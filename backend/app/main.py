from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.prompt_routes import router
from app.routes.auth_routes import router as auth_router

from app.database.database import engine
from app.database.models import Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://6a363f02a2c22e00082fcc2a--aidevops.netlify.app/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
app.include_router(router)

app.include_router(auth_router)

@app.get("/")
def home():

    return {
        "message": "Backend running"
    }
