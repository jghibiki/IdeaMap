cat tweetraining.csv | awk 'BEGIN{FS="\",\""}{if($1~"0"){print "\"neg\",\""$6}else if($1~"4"){print "\"pos\",\""$6}else{print "\"neu\",\""$6}}' >> tweet_training.csv
