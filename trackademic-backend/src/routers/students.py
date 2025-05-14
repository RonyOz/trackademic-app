from fastapi import APIRouter

router = APIRouter(
    prefix="/students",
    tags=["students"],
)

@router.get("/")
def get_endpoint():
    return {"message": "GET request to /students endpoint"}

@router.post("/")
def post_endpoint():
    return {"message": "POST request to /students endpoint"}

@router.put("/")
def put_endpoint():
    return {"message": "PUT request to /students endpoint"}

@router.delete("/")
def delete_endpoint():
    return {"message": "DELETE request to /students endpoint"} 