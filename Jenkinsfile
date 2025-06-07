pipeline {
    agent any;

    environment {
        IMAGE_NAME = 'oluwaseun7/node-app'
        SNYK_TOKEN = credentials('snyk-api-token')
        DOCKERHUB_CREDENTIALS = 'dockerhub'  
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.BUILD_TIMESTAMP = sh(script: "date +%Y%m%d-%H%M%S", returnStdout: true).trim()
                    env.IMAGE_TAG = "${env.GIT_COMMIT}-${env.BUILD_TIMESTAMP}"
                }
            }
        }

        stage('Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }
        
        stage('DockerHub Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                sh 'docker push $IMAGE_NAME:$IMAGE_TAG'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker rm -f node-app || true'
                sh 'sleep 5'
                sh "docker run -d -p 3002:8000 --name node-app $IMAGE_NAME:$IMAGE_TAG"
                sh 'sleep 5'
                sh 'docker ps | grep node-app'
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker system prune -f'
            }
        }
    }

    post {
        success {
            echo "✅ Docker image built, pushed, and deployed with tag: ${env.IMAGE_TAG}"
        }
        failure {
            echo "❌ Build or deployment failed"
        }
    }
}
