pipeline {

    agent any;

    environment {
        IMAGE_NAME = 'oluwaseun7/node-app'
        GIT_COMMIT = '' 
        BUILD_TIMESTAMP = '' 
    }

    stages {
        stage('Checkout') {

            agent {  
                label 'node1' 
            }

            steps {
                checkout scm
                script {
                    GIT_COMMIT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    BUILD_TIMESTAMP = sh(script: "date +%Y%m%d-%H%M%S", returnStdout: true).trim()
                    env.IMAGE_TAG = "${GIT_COMMIT}-${BUILD_TIMESTAMP}"
                }
            }
        }
        

        stage('Docker Image') {

            agent {  
                label 'node1' 
            }

            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }


       // stage('Security Scan') {
        //    steps {
        //      sh '''
          //         echo "Scanning Docker image with Trivy using Docker..."
            //       docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
              //     aquasec/trivy:latest image --ignore-unfixed --exit-code 0 $IMAGE_NAME:$IMAGE_TAG
               // '''
            //}
        //}


        stage('DockerHub Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
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
                sh "sleep 5"
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
            echo '✅ Docker image built, pushed, and deployed with tag: ' + env.IMAGE_TAG
        }
        failure {
            echo '❌ Build or deployment failed'
        }
    }
}