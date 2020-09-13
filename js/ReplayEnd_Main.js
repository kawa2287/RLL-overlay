function ReplayWillEndMain(d)
{
    $('#transitionLogo').removeClass('animate__rollIn');
        $('#transitionLogo').addClass('animate__rollOut');
        $('#transitionBg').removeClass('animate__fadeIn');
        $('#transitionBg').addClass('animate__fadeOut');
        $('#transitionBg').removeClass('hasBg');
        // document.getElementById('hidden-checkbox').click();
}