from fastapi import FastAPI, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# Auth config
SECRET_KEY = "nexus-studio-ultra-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

app = FastAPI(title="Nexus Studio API", version="1.0.0")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase init
SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    print("WARNING: Supabase URL or Key is missing. Check your .env file.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY) if SUPABASE_URL else None

class AnalyzeRequest(BaseModel):
    description: str

class UserLogin(BaseModel):
    identifier: str
    password: str

class ProjectCreate(BaseModel):
    title: str
    description: str
    category: str
    tags: List[str]
    image_url: Optional[str] = None
    status: str = "active"

class ProfileUpdate(BaseModel):
    full_name: str
    bio: str
    location: str
    expertise: List[str]

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to Nexus Studio API"}

@app.post("/auth/login")
def login(user: UserLogin):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    try:
        # Check by email or username
        res = supabase.table("profiles").select("*").or_(f"email.eq.{user.identifier},username.eq.{user.identifier}").execute()
        
        if not res.data:
            raise HTTPException(status_code=401, detail="User not found")
            
        found_user = res.data[0]
        
        if pwd_context.verify(user.password, found_user["password"]):
            token = create_access_token({"sub": found_user["id"], "email": found_user["email"]})
            return {
                "access_token": token,
                "token_type": "bearer",
                "user": {
                    "id": found_user["id"],
                    "email": found_user["email"],
                    "username": found_user["username"],
                    "full_name": found_user.get("full_name")
                }
            }
        raise HTTPException(status_code=401, detail="Invalid password")
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/projects")
def get_projects(category: Optional[str] = None, search: Optional[str] = None):
    if not supabase: return []
    
    try:
        # Fetch status='active' projects and include related profile for username
        query = supabase.table("projects").select("*, profiles(username)").eq("status", "active")
        
        if category:
            query = query.eq("category", category)
            
        res = query.execute()
        projects = res.data
        
        # Flatten owner_username for frontend compatibility
        for p in projects:
            p["owner_username"] = p.get("profiles", {}).get("username", "anonymous")
            
        if search:
            search = search.lower()
            projects = [
                p for p in projects 
                if search in p["title"].lower() or any(search in t.lower() for t in (p.get("tags") or []))
            ]
            
        return projects
    except Exception as e:
        print(f"Error fetching projects: {e}")
        return []

@app.post("/projects/create")
def create_project(project: ProjectCreate, user_id: str = Query(...)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    try:
        new_project = project.dict()
        new_project["owner_id"] = user_id
        
        res = supabase.table("projects").insert(new_project).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/studio/workspace")
def get_studio_workspace(user_id: str):
    if not supabase: return []
    try:
        res = supabase.table("projects").select("*").eq("owner_id", user_id).order("created_at", desc=True).execute()
        return res.data
    except Exception as e:
        print(f"Error fetching workspace: {e}")
        return []

@app.get("/user/profile")
def get_user_profile(user_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    try:
        res = supabase.table("profiles").select("*").eq("id", user_id).execute()
        if not res.data:
            # Fallback for new users
            return {
                "id": user_id,
                "full_name": "Nexus Creator",
                "bio": "Research lab established. Pending initialization.",
                "location": "Digital Frontier",
                "expertise": [],
                "stats": { "total_experience": "N/A", "active_labs": 0, "stars_earned": 0 }
            }
        
        profile = res.data[0]
        # Add mock stats for UI compatibility if needed
        profile["stats"] = { "total_experience": "6+ Years", "active_labs": 3, "stars_earned": 1240 }
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/user/profile/update")
def update_profile(profile: ProfileUpdate, user_id: str = Query(...)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    try:
        data = profile.dict()
        res = supabase.table("profiles").update(data).eq("id", user_id).execute()
        return {"status": "success", "data": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/projects/analyze")
def analyze_project(req: AnalyzeRequest):
    description = req.description.lower()
    suggested_tags = []
    
    keyword_map = {
        "react": ["react", "frontend", "ui", "components"],
        "fastapi": ["fastapi", "backend", "api", "python"],
        "python": ["python", "django", "flask", "script"],
        "generative ai": ["ai", "generative ai", "llm", "stable diffusion", "midjourney", "openai"],
        "robotics": ["robot", "ros", "hardware", "arduino", "raspberry pi"],
        "threejs": ["3d", "webgl", "threejs", "shader", "glsl"],
        "rust": ["rust", "wasm", "systems", "performance"]
    }
    
    for tag, keywords in keyword_map.items():
        if any(keyword in description for keyword in keywords):
            suggested_tags.append(tag)
            
    return {"suggested_tags": list(set(suggested_tags)) if suggested_tags else ["General"]}

@app.get("/studio/assets")
def get_studio_assets(user_id: str):
    return [
        {"id": "1", "name": "Avatar_Model.glb", "type": "3D Models", "size": "12.4 MB"},
        {"id": "2", "name": "VertexShader.glsl", "type": "Source Code", "size": "4 KB"},
        {"id": "3", "name": "MetalTexture.png", "type": "Textures", "size": "2.1 MB"}
    ]

@app.get("/studio/analytics")
def get_studio_analytics(user_id: str):
    return {
        "project_views": 1240,
        "build_success": "98.5%",
        "storage_used": "4.2 GB / 10 GB",
        "recent_activity": [
            {"event": "Build Completed", "date": "2 hours ago"},
            {"event": "Asset Uploaded", "date": "5 hours ago"}
        ]
    }
