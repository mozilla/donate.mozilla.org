var doNotTrack = navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack;
if (!doNotTrack || doNotTrack === 'no' || doNotTrack === "unspecified") {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  if (typeof ga === "function") {
    ga('create', 'UA-49796218-32', 'auto');

    // Ensure we don't pass the email query param to Google Analytics
    let protocol = window.location.protocol,
      hostname = window.location.hostname,
      pathname = window.location.pathname,
      filteredQueryParams = window.location.search.substring(1)
        .split('&')
        .filter(param => !param.startsWith('email'))
        .join('&');

    ga('set', 'location', `${protocol}//${hostname}${pathname}?${filteredQueryParams}`);
    ga('send' ,'pageview');
  }
}
