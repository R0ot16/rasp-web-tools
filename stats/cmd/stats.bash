# /bin/bash
tm=`mpstat -I CPU -N ALL -o JSON`
echo $tm
