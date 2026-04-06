import os
import psycopg2
from dotenv import load_dotenv
from passlib.context import CryptContext

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

DATABASE_URL = os.environ.get("DATABASE_URL")
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

if not DATABASE_URL:
    print("Error: DATABASE_URL not found.")
    exit(1)

def seed():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        print("Seeding mock users into profiles table...")
        
        # User 1: testuser
        u1_id = 'b1a0e0e0-e0e0-4000-8000-000000000001'
        u1_pass = pwd_context.hash("test")
        cur.execute("""
            INSERT INTO public.profiles (id, username, email, password, full_name, bio, location, expertise, avatar_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET 
                username = EXCLUDED.username,
                email = EXCLUDED.email,
                password = EXCLUDED.password
        """, (u1_id, "testuser", "test@gmail.com", u1_pass, "Nexus Creator", "Lead visionary at Nexus Studio.", "New York, NY", "System Architecture", "https://api.dicebear.com/7.x/avataaars/svg?seed=testuser"))

        # User 2: testuser2
        u2_id = 'b1a0e0e0-e0e0-4000-8000-000000000002'
        u2_pass = pwd_context.hash("test")
        cur.execute("""
            INSERT INTO public.profiles (id, username, email, password, full_name, bio, avatar_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET 
                username = EXCLUDED.username,
                email = EXCLUDED.email,
                password = EXCLUDED.password
        """, (u2_id, "testuser2", "test2@gmail.com", u2_pass, "Lab Associate", "Exploring the limits of GPU compute.", "https://api.dicebear.com/7.x/avataaars/svg?seed=testuser2"))

        print("Seeding mock projects...")
        
        projects = [
            ("Neural Engine Core", "Real-time synaptic mapping for edge devices.", "AI & Neural", ["TensorFlow", "React", "Rust"], u1_id, "active"),
            ("Quantum Viz", "3D Quantum State Visualizer.", "Web Experiments", ["React", "Threejs"], u1_id, "active"),
            ("Neon Synapse", "Low-latency biosensor dashboard.", "Biotech", ["Python", "Vite", "D3.js"], u2_id, "active"),
            ("Nexus OS Interface", "Conceptual UI for spatial computing.", "Design", ["Figma", "Swift"], u1_id, "archived")
        ]

        # Clear existing projects to avoid duplicates during seeding
        cur.execute("DELETE FROM public.projects")

        for title, desc, cat, tags, owner, status in projects:
            cur.execute("""
                INSERT INTO public.projects (title, description, category, tags, owner_id, status)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (title, desc, cat, tags, owner, status))

        conn.commit()
        print("Data migration and seeding complete!")

    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        if 'conn' in locals() and conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    seed()
