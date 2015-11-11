from django.test import TestCase
from .models import ProcessedTweet, Frame
from django.utils import timezone
from dateutil import parser
import json


# Create your tests here.
class ProcessedTweetGetJson(TestCase):
    def test_gets_json(self):
        expected_entities = {
            "hashtags": [
                {
                    "text": "access1",
                    "indices": [0, 1]
                }
            ],
            "user_mentions": [
                {
                    "id": 123,
                    "indices": [0, 1],
                    "id_str": "123",
                    "screen_name": "abc",
                    "name": "xyz"
                }
            ]
        }

        expected_coordinates = {
            "type": "Point",
            "coordinates": [1, 2]
        }

        expected_place = [
            [1, 2],
            [3, 4],
            [5, 6],
            [7, 8]
        ]
        expected_text = "abc"
        expected_date = timezone.now()
        expected_rating = 1.234
        expected_classification = "pos"

        expected_frame = Frame(
            start_date=expected_date,
            end_date=expected_date
        )

        tweet = ProcessedTweet(
            entities=json.dumps(expected_entities),
            processed_date=expected_date,
            created_date=expected_date,
            coordinates=json.dumps(expected_coordinates),
            place=json.dumps(expected_place),
            text=expected_text,
            original=expected_text,
            rating=expected_rating,
            classification=expected_classification,
            frame=expected_frame
        )

        actual_json = json.loads(tweet.getJson())

        self.assertEqual(
            actual_json["entities"],
            expected_entities
        )
        self.assertEqual(
            parser.parse(actual_json["processed_date"]),
            expected_date
        )
        self.assertEqual(
            parser.parse(actual_json["created_date"]),
            expected_date
        )
        self.assertEqual(
            actual_json["coordinates"],
            expected_coordinates
        )
        self.assertEqual(
            actual_json["place"],
            expected_place
        )
        self.assertEqual(
            actual_json["text"],
            expected_text
        )
        self.assertEqual(
            actual_json["original"],
            expected_text
        )
        self.assertEqual(
            actual_json["rating"],
            expected_rating
        )
        self.assertEqual(
            actual_json["classification"],
            expected_classification
        )
        self.assertEqual(
            actual_json["frame"]["id"],
            expected_frame.id
        )
        self.assertEqual(
            parser.parse(actual_json["frame"]["start_date"]),
            expected_date
        )
        self.assertEqual(
            parser.parse(actual_json["frame"]["end_date"]),
            expected_date
        )

