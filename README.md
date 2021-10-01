# kuepaTechnicalTest
Prueba tecnica para Backend NodeJS en Kuepa

## 1. **Contexto**:
 El equipo académico de Kuepa ofrece streaming de sus clases virtuales en el LMS de la organización, que están disponibles solo para estudiantes. En estos streaming los estudiantes pueden visualizar un video mientras el docente dicta la clase.

## 2. **Objetivo**: 
Como equipo académico se quiere brindar una herramienta de interacciones a las clases virtuales que permita la interacción entre los participantes y el moderador de la clase.

## 3. **Instalacion del proyecto:**
    1. Descarga el proyecto haciendo uso de git
        git clone https://github.com/jdvr1994/kuepaTechnicalTest

    2. Instala los modulos requeridos por el proyecto
        npm i

    3. Intala mongodb
        Recuerda que este es un proyecto que hace uso de mongoDB para persistencia de datos. Por ese motivo debes tener instalado mongoDb en tu computadora. (o usar una instancia de mongo Atlas)
    
    4. Ejecuta el proyecto en en la instancia de desarrollo
        3.1 Si usas powershell puedes configurar las variables de entorno como sigue:
            - $env:APP_ENV = "development"
        3.2 Ejecuta el proyecto con el siguiente comando:
            - npm run start:dev

    5. Para ejecutar los test del proyecto ingresa el siguiente comando:
        - npm test

    **_NOTA_: ** El codigo del proyecto esta suficientemente comentado, por esta razón, un primer acercamiento a la compresion de la API puede obtenerse revisando los archivos de testeo, los cuales permiten observar de manera clara la dinamica de funcionamiento de la API.

## 4. **Probar la API con Postman:**
    1. Abre postman e importa el archivo llamado: 
        KuepaAPI.postman_collection.json

    2. Una vez importado el archivo podras realizar las peticiones http a la API del proyecto de manera facil. (Recuerda leer la documentación de la API antes de comenzar con las pruebas)


## 5. **AWS Elastic Beanstalk:**

    1. Tambien puedes probar el proyecto en produccion en una instancia de AWS Elastic Beanstalk:

        URL_BASE = http://kuepatest.us-east-2.elasticbeanstalk.com/
        URL_API = http://kuepatest.us-east-2.elasticbeanstalk.com/api

    Esta instancia se se conecta con Mongo Atlas, por este motivo el proyecto funciona de igual forma que en local. 

# **Documentación API:**

# 1. **Moderator Routes:**  
Para comenzar a interactuar con la API te recomiendo comenzar con esta entidad llamada Moderador. 
Esta entidad representa al profesor encargado de dictar una clase virtual así que es el que podra crear las entidades "Clases" para que posteriormente los estudiantes se subscriban a ellas e interactuen enviando "Likes" durante el transcurso de la clase.

#### 1.1 **GET ALL:**
    1. **Description** : Permite obtener todos los moderadores en forma de una lista de usuarios
    2. **Uso**
        {
            url:"/api/moderator/" 
            metodo: GET,
            isAuth: true,
            authLevel: "moderator"
        }

        **isAuth => Indica si requiere autenticación basada en token para acceder a este servicio
        **authLevel => Solo con token perteneciente a la entidad "authLevel" se puede hacer uso de esta ruta

#### 1.2 **GET MODERATOR:**
    1. **Description** : Permite obtener un moderador pasando como parametro el id del moderador
    2. **Uso**
        {
            url:"/api/moderator/:id" 
            metodo: GET,
            isAuth: true,
            authLevel: "moderator"
        }

#### 1.3 **CREATE MODERATOR:**
    1. **Description** : Permite registrar un nuevo moderador en la base de datos
    2. **Uso**
        {
            url:"/api/moderator" 
            metodo: POST,
            content-type: application/json,
            isAuth: false,
            body: {
                userName: string,
                password: string,
                names: string,
                lastNames: string,
                phone: string
            }
        }

#### 1.4 **LOGIN MODERATOR:**
    1. **Description** : Permite autenticarse como moderador. Esto nos permitira obtener un token con nivel de autenticación "moderador"

    2. **Uso**
        {
            url:"/api/moderator/login" 
            metodo: POST,
            content-type: application/json,
            isAuth: false,
            body: {
                userName: string,
                password: string,
            }
        }

#### 1.5 **GET MY STUDENTS:**
    1. **Description** : Permite obtener un listado de todos los estudiantes que tienen clases con el moderador.

    2. **Uso**
        {
            url:"/api/moderator/:id/my-students" 
            metodo: GET,
            content-type: application/json,
            isAuth: true,
            authLevel: "moderator"
        }

#### 1.6 **UPDATE MODERATOR :**
    1. **Description** : Permite actualizar algunos cambios de un moderador.

    2. **Uso**
        {
            url:"/api/moderator/:id" 
            metodo: PUT,
            content-type: application/json,
            isAuth: true,
            authLevel: "moderator",
            body: {
                names: string,
                lastNames: string,
                phone: string
            }
        }

#### 1.7 **DELETE MODERATOR :**
    1. **Description** : Permite actualizar algunos cambios de un moderador.

    2. **Uso**
        {
            url:"/api/moderator/:id" 
            metodo: DELETE,
            content-type: application/json,
            isAuth: true,
            authLevel: "admin"
        }

        ** authLevel: "admin" => Por el momento no esta activa la opcion de crear administradores por lo tanto no se puede acceder a esta ruta en la version actual de la API.

# 2. **Student Routes:**  
Una vez contamos con moderadores capaces de crear Clases. Podemos continuar con la creacion de una entidad llamada Estudiante, la cual nos permitira subscribirnos a las clases virtuales y enviar "likes" los cuales se almacenaran con una marca de tiempo. Para esta entidad contamos con las siguientes rutas:

#### 2.1 **GET ALL:**
    1. **Description** : Permite obtener todos los estudiantes en forma de una lista de usuarios
    2. **Uso**
        {
            url:"/api/student/" 
            metodo: GET,
            isAuth: true,
            authLevel: "moderador" || "estudiante"
        }

        **isAuth => Indica si requiere autenticación basada en token para acceder a este servicio
        **authLevel => Solo con token perteneciente a la entidad "authLevel" se puede hacer uso de esta ruta

#### 2.2 **GET STUDENT:**
    1. **Description** : Permite obtener un estudiante pasando como parametro el id del estudiante
    2. **Uso**
        {
            url:"/api/student/:id" 
            metodo: GET,
            isAuth: true,
            authLevel: "moderador" || "estudiante"
        }

#### 2.3 **CREATE STUDENT:**
    1. **Description** : Permite registrar un nuevo estudiante en la base de datos
    2. **Uso**
        {
            url:"/api/student/" 
            metodo: POST,
            content-type: application/json,
            isAuth: false,
            body: {
                userName: string,
                password: string,
                names: string,
                lastNames: string,
                phone: string
            }
        }

#### 2.4 **LOGIN STUDENT:**
    1. **Description** : Permite autenticarse como estudiante. Esto nos permitira obtener un token con nivel de autenticación "estudiante"

    2. **Uso**
        {
            url:"/api/student/login" 
            metodo: POST,
            content-type: application/json,
            isAuth: false,
            body: {
                userName: string,
                password: string,
            }
        }

#### 2.5 **GET LOGIN HISTORY:**
    1. **Description** : Permite obtener un listado de todos los inicios de sesión que ha tenido el estudiante.

    2. **Uso**
        {
            url:"/api/student/:id/login-history" 
            metodo: GET,
            content-type: application/json,
            isAuth: true,
            authLevel: "estudiante"
        }

#### 2.6 **UPDATE STUDENT :**
    1. **Description** : Permite actualizar algunos cambios de un estudiante.

    2. **Uso**
        {
            url:"/api/moderator/:id" 
            metodo: PUT,
            content-type: application/json,
            isAuth: true,
            authLevel: "estudiante",
            body: {
                names: string,
                lastNames: string,
                phone: string
            }
        }

#### 2.7 **DELETE STUDENT :**
    1. **Description** : Permite actualizar algunos cambios de un estudiante.

    2. **Uso**
        {
            url:"/api/student/:id" 
            metodo: DELETE,
            content-type: application/json,
            isAuth: true,
            authLevel: "admin"
        }

        ** authLevel: "admin" => Por el momento no esta activa la opcion de crear administradores por lo tanto no se puede acceder a esta ruta en la version actual de la API.

### 3. **Class Routes:**  
El nucleo de esta API son las Clases virtuales asi que todo el funcionamiento de la API gira entorno a esta entidad. Para esta entidad contamos con las siguientes rutas:

#### 3.1 **GET ALL:**
    1. **Description** : Permite obtener todos las clases en forma de una lista de clases
    2. **Uso**
        {
            url:"/api/class/" 
            metodo: GET,
            isAuth: true,
            authLevel: "moderador" || "estudiante"
        }

        **isAuth => Indica si requiere autenticación basada en token para acceder a este servicio
        **authLevel => Solo con token perteneciente a la entidad "authLevel" se puede hacer uso de esta ruta

#### 3.2 **GET CLASS:**
    1. **Description** : Permite obtener una clase pasando como parametro el id de la clase
    2. **Uso**
        {
            url:"/api/class/:id" 
            metodo: GET,
            isAuth: true,
            authLevel: "moderador" || "estudiante"
        }

#### 3.3 **GET CLASSES BY MODERATOR:**
    1. **Description** : Permite obtener las clases creadas por el moderador pasando como parametro el id del moderador.
    2. **Uso**
        {
            url:"/api/class/moderator/:id" 
            metodo: GET,
            isAuth: true,
            authLevel: "moderador"
        }

#### 3.4 **GET CLASSES BY STUDENT:**
    1. **Description** : Permite obtener las clases a las que pertenece un estudiante pasando como parametro el id del estudiante.
    2. **Uso**
        {
            url:"/api/class/student/:id" 
            metodo: GET,
            isAuth: true,
            authLevel: "moderador" || "estudiante"
        }

#### 3.5 **GET INTERACTIONS:**
    1. **Description** : Permite obtener un reporte de las interacciones que tuvo cada uno de los estudiantes en la clase virtual. Para que sea mas facil probar la API se desactivo la verificación de hora de interaccion, es decir, un estudiante puede usar la API para enviar "likes" a una clase aun cuando esta no haya comenzado.

    2. **Uso**
        {
            url:"/api/class/:id/interactions/" 
            metodo: GET,
            isAuth: true,
            authLevel: "moderador"
        }

#### 3.6 **CREATE CLASS:**
    1. **Description** : Permite crear una clase virtual pasando como parametro la id de la clase, y como cuerpo del mensaje el id del moderador.
    2. **Uso**
        {
            url:"/api/class/" 
            metodo: POST,
            content-type: application/json,
            isAuth: false,
            body: {
                title: string,
                description: string,
                startDate: string (dateFormat),
                endDate: string (dateFormat),
                moderator: string
            }
        }

#### 3.7 **SUBSCRIBE STUDENT:**
    1. **Description** : Permite subscribir a un estudiante a una clase pasando como parametro la id de la clase y la id del estudiante como cuerpo del mensaje. 
    2. **Uso**
        {
            url:"/api/class/:id/subscribe-student" 
            metodo: PUT,
            content-type: application/json,
            isAuth: true,
            authLevel: "estudiante"
            body: {
                userId: string,
            }
        }

#### 3.8 **SEND LIKE:**
    1. **Description** : Permite a un estudiante enviar un "like" a una clase pasando como parametro la id de la clase y la id del estudiante como cuerpo del mensaje. 
    2. **Uso**
        {
            url:"/api/class/:id/like" 
            metodo: PUT,
            content-type: application/json,
            isAuth: true,
            authLevel: "estudiante"
            body: {
                userId: string,
            }
        }

#### 3.9 **UPDATE CLASS :**
    1. **Description** : Permite actualizar algunos campos de la clase.

    2. **Uso**
        {
            url:"/api/moderator/:id/my-students" 
            metodo: PUT,
            content-type: application/json,
            isAuth: true,
            authLevel: "moderador",
            body: {
                title: string,
                description: string
            }
        }

#### 3.10 **DELETE CLASS :**
    1. **Description** : Permite eliminar una clase.

    2. **Uso**
        {
            url:"/api/moderator/:id/my-students" 
            metodo: DELETE,
            content-type: application/json,
            isAuth: true,
            authLevel: "admin"
        }

        ** authLevel: "admin" => Por el momento no esta activa la opcion de crear administradores por lo tanto no se puede acceder a esta ruta en la version actual de la API.

