echo "Checking out to main"
git checkout main

echo "Building app..."
npx tsc

echo "Deploying to server..."
scp -i c:/Users/Bryan\ Sanchez/.ssh/ec2-kp.pem -r dist/* package.json package-lock.json ec2-user@3.27.167.101:/var/www/3.27.167.101-server/

echo "Deploy finished!"