from fastapi import APIRouter

router = APIRouter(
    prefix="/plans",
    tags=["plans"],
)

@router.get("/")
def get_endpoint():
    return {"message": "GET request to /plans endpoint"}

@router.post("/")
def post_endpoint():
    return {"message": "POST request to /plans endpoint"}

@router.put("/")
def put_endpoint():
    return {"message": "PUT request to /plans endpoint"}

@router.delete("/")
def delete_endpoint():
    return {"message": "DELETE request to /plans endpoint"} 