from fastapi import APIRouter

router = APIRouter(
    prefix="/grades",
    tags=["grades"],
)

@router.get("/")
def get_endpoint():
    return {"message": "GET request to /grades endpoint"}

@router.post("/")
def post_endpoint():
    return {"message": "POST request to /grades endpoint"}

@router.put("/")
def put_endpoint():
    return {"message": "PUT request to /grades endpoint"}

@router.delete("/")
def delete_endpoint():
    return {"message": "DELETE request to /grades endpoint"} 