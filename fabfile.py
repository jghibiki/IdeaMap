from fabric.api import local, lcd
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

    if app == "all" or app=="app":
        with lcd("source/app"):
            print("Starting Web App")
            local("python2 start.py > ../../app.log 2>&1 &")

def monitor_test():
    local("tail -f analyzer.log -f streamer.log -f app.log")


def stop_test():
    local("pkill python")
