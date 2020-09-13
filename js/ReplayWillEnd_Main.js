function ReplayWillEndMain(d)
{
    setTimeout(function() {
        $('#transitionLogo').removeClass('animate__rollOut');
        $('#transitionLogo').addClass('animate__rollIn');
        $('#transitionBg').addClass('hasBg');
        $('#transitionBg').removeClass('animate__fadeOut');
        $('#transitionBg').addClass('animate__fadeIn');
        //your code to be executed after 1 second
        // document.getElementById('hidden-checkbox').click();
      }, 1000);
}