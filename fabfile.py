from __future__ import with_statement
from fabric.api import *
from fabric.contrib.console import confirm
#import shutil

env.hosts = ["jghibiki@streamer01.is-leet.com"]

def deploy():
    code_dir = "/IdeaMap"
    django_dir = "/IdeaMap"

    print("Beginning Local Deploy")

    if confirm("Run 'git pull?'", default=False):
        with lcd(code_dir):
            local("git pull")

    if confirm("Update Database?", default=False):
        with cd(django_dir):
            if confirm("Generate Migrations?", default=False):
                local("python manage.py makemigrations")

            if confirm("Run Migrations?", default=False):
                local("python manage.py migrate")

    if confirm("Collect Static Files?", default=False):
        with cd(django_dir):
            local("python manage.py collectstatic --noinput")

    if confirm("Generate Analyzer ML cache?", default=False):
        with cd(django_dir):
            local("python Analyzer/train.py")

    if confirm("Restart Celery Workers", default= False):
        with lcd(django_dir):
            local("sudo systemctl restart celery")

    if confirm("Reload Gunicorn?", default=False):
        local("sudo systemctl reload ideamap")

    print("Finished Deploying!")

def deploy_remote():
    code_dir = "/IdeaMap"
    django_dir = "/IdeaMap"

    print("Beginning Remote Deploy")

    if confirm("Run 'git pull?'", default=False):
        with cd(code_dir):
            run("git pull")

    if confirm("Update Database?", default=False):
        with cd(django_dir):
            if confirm("Generate Migrations?", default=False):
                run("python manage.py makemigrations")

            if confirm("Run Migrations?", default=False):
                run("python manage.py migrate")

    if confirm("Collect Static Files?", default=False):
        with cd(django_dir):
            run("python manage.py collectstatic --noinput")

    if confirm("Generate Analyzer ML cache?", default=False):
        with cd(django_dir):
            run("python Analyzer/train.py")

    if confirm("Restart Celery Workers", default= False):
        with cd(django_dir):
            run("sudo systemctl restart celery")

    if confirm("Reload Gunicorn?", default=False):
        run("sudo systemctl reload ideamap")

    print("Finished Deploying!")

def whipe_remote_db():
    if confirm("Are you sure you wish to wipe the remote databse?", default=False):
        if confirm("Are you really sure?", default=False):
            with cd("/IdeaMap/source/IdeaMap"):
                run("python manage.py sqlflush | python manage.py dbshell")


def remote_manager(command=""):
    with cd("/IdeaMap/source/IdeaMap"):
        run("python manage.py " + command)

def remote_db():
    run("sudo su postgres -c psql")

# def start_test(app="all"):

#     shutil.copyfile("config/models.config.yml", "source/models/config.yml")
#     shutil.copyfile("config/streamer.config.yml", "source/streamer/config.yml")

#     if app == "all" or app == "analyzer":
#         with lcd("source/analyzer"):
#             print("Starting Analyzer")
#             local("python2 analyzer.py > ../../analyzer.log 2>&1 &")

#     if app == "all" or app == "streamer":
#         with lcd("source/streamer"):
#             print("Starting Streamer")
#             local("python2 start.py > ../../streamer.log 2>&1 &")

#     if app == "all" or app =="app":
#         with lcd("source/app"):
#             print("Starting Web App")
#             local("python2 start.py > ../../app.log 2>&1 &")


# def monitor_test():
#     local("tail -f analyzer.log -f streamer.log -f app.log")


# def stop_test():
#     local("pkill python")


# def query(query=None):
#     if query is None:
#         print("Must specify a query.")

#     shutil.copyfile("config/models.config.yml", "source/models/config.yml")

#     from os import path
#     from peewee import PostgresqlDatabase
#     from yaml import load
#     with open(path.abspath("source/models/config.yml"), "rb") as f:
#         config = load(f)

#     db_config = config["database"]

#     db = PostgresqlDatabase(
#         db_config["db"],
#         host=db_config["url"],
#         user=db_config["username"],
#         password=db_config["password"])

#     print("Result:")
#     cursor = db.execute_sql(query)
#     for row in cursor.fetchall():
#         if len(row) == 1:
#             print(row[0])
#         else:
#             print(row)
