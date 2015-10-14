import re, json, ast, sys, os, datetime, pytz
from string import punctuation
sys.path.insert(0, os.path.abspath("../models"))
from Models import *


def main():
    count = 0
    with open("../data.json", "r") as f:

        for line in f:

            line = ast.literal_eval(line)

            if line["coordinates"] != None:
                line = preprocess(line)

                with db.atomic():
                    Tweet.create(
                        entities = json.dumps(line["entities"]),
                        created_at = datetime.datetime.strptime(line["created_at"], '%a %b %d %H:%M:%S +0000 %Y').replace(tzinfo=pytz.UTC),
                        coordinates = json.dumps(line["coordinates"]),
                        text = line["text"],
                        original = line["original"]

                    )
                count += 1
                print count

def preprocess(data):
    data["original"] = data["text"]
    temp = data["text"]
    temp.lower()

    #remove repetitive punctuation
    for p in list(punctuation):
        temp.replace("rt", "retweet")
        temp.replace("b/c", "because")
        temp.replace("@reply", "")
        temp.replace(" b ", " be ")
        temp.replace("b4", "before")
        temp.replace(" ab ", " about ")
        temp.replace(" abt ", " about ")
        temp.replace(" bfn ", " bye for now ")
        temp.replace(" br ", " best reguards ")
        temp.replace(" chk ", " check ")
        temp.replace(" cld ", " could ")
        temp.replace(" cre8 ", " create ")
        temp.replace(" da ", " the ")
        temp.replace(" dt ", " direct tweet ")
        temp.replace(" em ", " email ")
        temp.replace(" fab ", " fabulous ")
        temp.replace(" fav ", " favorite ")
        temp.replace(" ic ", " i see ")
        temp.replace(" icymi ", " in case you missed it")
        temp.replace(" idk ", " i don't know ")
        temp.replace(" kk ", " that is nice ")
        temp.replace(" selfie ", " a picture of myself ")
        temp.replace(" tbt ", " throw back Thursday ")
        temp.replace(" tweet ", " a twitter status update ")
        temp.replace(" tweeting ", " writing a twitter status update ")
        temp.replace(" u ", " you ")
        temp.replace(" r ", " are ")
        temp.replace(" luv ", " love ")


        temp = temp.replace(p, "")

    data["text"] = temp
    return data


if __name__ == "__main__":
    main()
