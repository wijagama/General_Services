from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mysqldb import MySQL
from sqlalchemy import text
import base64

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
servidor = 'localhost'
user = 'root'
password = 'admin'
bd = 'general_services'

app.config['SQLALCHEMY_DATABASE_URI'] = f"mssql+pyodbc://{user}:{password}@{servidor}/{bd}?driver=ODBC+Driver+17+for+SQL+Server"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Verificar conexión a la base de datos
try:
    with app.app_context():
        db.session.execute(text('SELECT 1'))
    print("Conexión a la base de datos exitosa")
except Exception as e:
    print(f"Error al conectar a la base de datos: {e}")

# Modelo de Usuario
class Usuario(db.Model):
    __tablename__ = 'UsersGeneral'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(50), nullable=False)
    correo = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    especialidad = db.Column(db.String(50), nullable=False)
    resumen = db.Column(db.String(50), nullable=False)
    foto = db.Column(db.LargeBinary, nullable=True)
    nombre_foto = db.Column(db.String(255), nullable=True)

# API para registrar un usuario
@app.route('/api/registro', methods=['POST'])
def registrar_usuario():
    nombre = request.form.get("name")
    correo = request.form.get("email")
    phone = request.form.get("phone")
    especialidad = request.form.get("specialty")
    resumen = request.form.get("summary")
    file = request.files.get("file")

    if not all([nombre, correo, phone, especialidad, resumen]):
        return jsonify({"success": False, "message": "Todos los campos son obligatorios"}), 400

    nuevo_usuario = Usuario(
        nombre=nombre, 
        correo=correo, 
        phone=phone, 
        especialidad=especialidad, 
        resumen=resumen,
        foto=file.read() if file else None,
        nombre_foto=file.filename if file else None
    )

    try:
        db.session.add(nuevo_usuario)
        
        db.session.commit()
        return jsonify({"success": True, "message": "Usuario registrado exitosamente"}), 201
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"success": False, "message": f"Error al registrar usuario: {str(e)}"}), 500

#obtener todos los usuarios
@app.route('/api/usuarios', methods=['GET'])
def obtener_usuarios():
    try:
        usuarios = Usuario.query.all()
        resultado = [
            {
                "id": usuario.id,
                "nombre": usuario.nombre,
                "correo": usuario.correo,
                "phone": usuario.phone,
                "especialidad": usuario.especialidad,
                "resumen": usuario.resumen,
                "nombre_foto": usuario.nombre_foto,
                "foto": base64.b64encode(usuario.foto).decode('utf-8') if usuario.foto else None
            }
            for usuario in usuarios
        ]
        return jsonify(resultado), 200
    except Exception as e:
        print(e)
        return jsonify({"success": False, "message": f"Error al obtener usuarios: {str(e)}"}), 500

#usuario por id
@app.route('/api/usuarios/<int:id>', methods=['GET'])
def obtener_usuario(id):
    try:
        usuario = Usuario.query.get(id)
        if usuario:
            foto_base64 = base64.b64encode(usuario.foto).decode('utf-8') if usuario.foto else None
            return jsonify({
                "id": usuario.id,
                "nombre": usuario.nombre,
                "correo": usuario.correo,
                "phone": usuario.phone,
                "especialidad": usuario.especialidad,
                "resumen": usuario.resumen,
                "foto": foto_base64,  
                "nombre_foto": usuario.nombre_foto
            }), 200
        
        return jsonify({"success": False, "message": "Usuario no encontrado"}), 404
    except Exception as e:
        print(e)
        return jsonify({"success": False, "message": f"Error al obtener usuario: {str(e)}"}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
