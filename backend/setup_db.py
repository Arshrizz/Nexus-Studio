import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    print("Error: DATABASE_URL not found in .env file.")
    print("Please add your Supabase connection string to .env.")
    print("Example: DATABASE_URL=postgresql://postgres.xxx:password@aws-0-xxxx.pooler.supabase.com:6543/postgres")
    exit(1)

def run_migrations():
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        # Read the schema file
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        with open(schema_path, 'r') as file:
            sql_script = file.read()

        print("Applying schema.sql...")
        cur.execute(sql_script)
        
        # Commit the transaction
        conn.commit()
        print("Schema applied successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if 'conn' in locals() and conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    run_migrations()
