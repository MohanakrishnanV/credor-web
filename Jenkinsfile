pipeline 
{
  agent any
 
  tools {nodejs "v14.17.4"}
 
   stages 
   {
    stage('GitHub Checkout') 
    {
      steps 
      {
        git 'https://github.com/MohanakrishnanV/credor-web.git'
      }
    }
  
    stage('NPM Build') 
    {
      steps 
      {
        dir ('/var/lib/jenkins/workspace/credor-web/Frontend')
        {
            sh 'npm install'
            sh 'npm run build'
        }
      }
    }
    
    stage('Clear Previous build')
    {
        steps
        {
            dir ('/var/www/html')
            {
                sh 'rm -vrf *'
            }
        }
        
    }
    
    stage('Publishing Archive Files')
    {
        steps
        {
            dir ('/var/lib/jenkins/workspace/credor-web')
            {
                sh 'mv * -f /var/www/html/'
            }
        }
        
    }
    
    stage('Deploying in Apache2')
    {
        steps
        {
            dir ('/var/www/html/Frontend/dist/Credor')
            {
                sh 'mv * -f /var/www/html/'
            }
        }
        
    }

   }
}
