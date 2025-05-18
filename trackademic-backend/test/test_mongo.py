from src.db.mongo import db

def test_connection():
    try:
        print("Conectando a MongoDB Atlas...")
        collection = db["prueba_conexion"]
        result = collection.insert_one({"mensaje": "Hola desde MongoDB Atlas!"})
        print("✅ Conectado. ID insertado:", result.inserted_id)

        # Leer documento insertado
        doc = collection.find_one({"_id": result.inserted_id})
        print("📄 Documento:", doc)
    except Exception as e:
        print("❌ Error:", e)

if __name__ == "__main__":
    test_connection()
