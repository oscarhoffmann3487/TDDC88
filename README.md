## Getting started

Install Node.js verison 18.18.0
npm install -g @angular/cli
cd/c1-2023-app run npm i

npm install jquery --save
npm install @angular/material @angular/cdk
## Start up project

För att få upp angular:
1. Starta ny terminal i VSC
2. Gå till mappen "c1-2023-app"
3. Skriv "ng serve"

To start Django (restAPI):
If you haven't created a virtual environment do that first
1. Go to DjangoAPI folder .\tddc88-company-1-2023\DjangoAPI
2. python -m venv venv
3. Start the virtual environment: .venv\Scripts\activate or source venv/bin/activate
4. While in the virtual environment download the necessary requirements
    - pip install -r requirements.txt (might need to use pip3)

Setup the database:
1. Go to .\tddc88-company-1-2023\DjangoAPI
2. Start your Virtual Environment
3. Write the following commands:
    - python manage.py makemigrations
    - python manage.py migrate
        - If user and Improvment were not part of the migrations
        - python manage.py makemigrations user
        - python manage.py makemigrations Improvment (it is sensitive to caps)
        - python manage.py migrate user
        - python manage.py migrate Improvment (it is sensitive to caps)
    - python manage.py runserver
4. After the database has been made and is running open a **new** terminal and write the following commands:
    - Go to .\tddc88-company-1-2023\DjangoAPI
    - python populatedb.py
        - You will be asked to if you want to wipe the database (yes/no) write yes
        - This should populate the database with all of the improvement works.


To be able to test using pytest
1. Start your virtual environment
2. pip install pytest-django
3. pytest (this will run the tests currently reciding in the tests folder)
