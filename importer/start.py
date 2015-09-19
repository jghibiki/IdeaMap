import re, json, ast, sys, os, datetime, pytz
sys.path.insert(0, os.path.abspath("../models"))
from Models import *


def main():
    count = 0
    with open("../data.json", "r") as f:

        for line in f:
            count += 1
            print count

            line = ast.literal_eval(line)

            with db.atomic():
                Tweet.create(
                    entities = json.dumps(line["entities"]),
                    created_at = datetime.datetime.strptime(line["created_at"], '%a %b %d %H:%M:%S +0000 %Y').replace(tzinfo=pytz.UTC),
                    hasGeo = (line["coordinates"] != None),
                    coordinates = json.dumps(line["coordinates"]),
                    text = line["text"]
                )

if __name__ == "__main__":
    main()
