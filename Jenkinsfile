pipeline {
    agent any

    stages {
        stage('Instalar dependencias') {
            steps {
                bat 'npm install'
            }
        }

        stage('Ejecutar pruebas') {
            steps {
                bat 'npm test'
            }
        }

        stage('Desplegar BarberApp') {
            steps {
                bat '''
                if not exist C:\\deploy\\BarberApp mkdir C:\\deploy\\BarberApp
                xcopy /E /I /Y assets C:\\deploy\\BarberApp\\assets
                xcopy /E /I /Y citas C:\\deploy\\BarberApp\\citas
                xcopy /E /I /Y clientes C:\\deploy\\BarberApp\\clientes
                xcopy /E /I /Y login C:\\deploy\\BarberApp\\login
                xcopy /E /I /Y servicios C:\\deploy\\BarberApp\\servicios
                copy /Y index.html C:\\deploy\\BarberApp\\index.html
                copy /Y app.js C:\\deploy\\BarberApp\\app.js
                '''
            }
        }
    }
}