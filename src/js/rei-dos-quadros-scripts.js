var stableVerify = function () {
  return window.location.href.indexOf('vtex') >= 0
}

stableVerify() && $('body').addClass('stable')