function secondsToMS(d) 
{
    d = Math.ceil(Number(d));
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var mDisplay = m ;
    var sDisplay = (s < 10 ? "0" : "") + s;
    return mDisplay +":"+ sDisplay; 
}

function PlayAnimation(loc, animClass, duration)
{
    $(loc).addClass(animClass);
    //Clear animation
    setTimeout(function() {
        $(loc).removeClass(animClass);
    }, duration);
}