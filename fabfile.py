from fabric.api import local, lcd, cd
import shutil

def start_test(app="all"):

    shutil.copyfile("config/models.config.yml", "source/models/config.yml")
    shutil.copyfile("config/streamer.config.yml", "source/streamer/config.yml")

    if app == "all" or app == "analyzer":
        with lcd("source/analyzer"):
            print("Starting Analyzer")
            local("python2 analyzer.py > ../../analyzer.log 2>&1 &")

    if app == "all" or app == "streamer":
        with lcd("source/streamer"):
            print("Starting Streamer")
            local("python2 start.py > ../../streamer.log 2>&1 &")

    if app == "all" or app =="app":
        with lcd("source/app"):
            print("Starting Web App")
            local("python2 start.py > ../../app.log 2>&1 &")


def monitor_test():
    local("tail -f analyzer.log -f streamer.log -f app.log")


def stop_test():
    local("pkill python")


def query(query=None):
    if query is None:
        print("Must specify a query.")

    from os import path
    from peewee import PostgresqlDatabase
    from yaml import load
    with open(path.abspath("source/models/config.yml"), "rb") as f:
        config = load(f)

    db_config = config["database"]

    db = PostgresqlDatabase(
        db_config["db"],
        host=db_config["url"],
        user=db_config["username"],
        password=db_config["password"])

    print("Result:")
    cursor = db.execute_sql(query)
    for row in cursor.fetchall():
        if len(row) == 1:
            print(row[0])
        else:
            print(row)
