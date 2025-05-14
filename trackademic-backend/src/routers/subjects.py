from fastapi import APIRouter

router = APIRouter(
    prefix="/subjects",
    tags=["subjects"],
)

@router.get("/")
def get_endpoint():
    return {"message": "GET request to /subjects endpoint"}

@router.post("/")
def post_endpoint():
    return {"message": "POST request to /subjects endpoint"}

@router.put("/")
def put_endpoint():
    return {"message": "PUT request to /subjects endpoint"}

@router.delete("/")
def delete_endpoint():
    return {"message": "DELETE request to /subjects endpoint"} 