using System;
using System.Threading.Tasks;

namespace UserCore
{
    public class ConfirmationEmailGenerator
    {
        private readonly IApiRouteResolver _apiRouteResolver;

        public ConfirmationEmailGenerator(IApiRouteResolver apiRouteResolver)
        {
            _apiRouteResolver = apiRouteResolver;
        }

        public string GetEmailSubject()
        {
            return "Please confirm your email with Imguin";
        }

        public async Task<string> GetEmailBody(string apiName, string apiRegion, string codeParameter, string username, string clientId)
        {
            string apiRootUrl = await _apiRouteResolver.Resolve(apiName, apiRegion);
            string confirmationUrl = $"{apiRootUrl}user/confirmEmail?Code={codeParameter}&Username={username}&ClientId={clientId}";

            return
$@"<!DOCTYPE html>
<html lang=""en"">
  <head>
    <meta charset=""UTF-8"" />
    <meta http-equiv=""X-UA-Compatible"" content=""IE=edge"" />
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"" />
    <title>Document</title>
  </head>
  <body style=""background-color: gray"">
    <div
      style=""
        width: 100vw;
        display: flex;
        flex-direction: column;
        background-color: white;
        border-radius: 5px;
        align-items: center;
      ""
    >
      <div
        style=""
          flex: 1 1 100%;
          min-height: 300px;
          width: 100%;
          background-color: #2b3b41;
          display: flex;
          justify-content: center;
          align-items: center;
        ""
      >
        <?xml version=""1.0"" encoding=""UTF-8"" standalone=""no""?>
        <svg
          xmlns:dc=""http://purl.org/dc/elements/1.1/""
          xmlns:cc=""http://creativecommons.org/ns#""
          xmlns:rdf=""http://www.w3.org/1999/02/22-rdf-syntax-ns#""
          xmlns:svg=""http://www.w3.org/2000/svg""
          xmlns=""http://www.w3.org/2000/svg""
          xmlns:sodipodi=""http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd""
          xmlns:inkscape=""http://www.inkscape.org/namespaces/inkscape""
          sodipodi:docname=""imguin.svg""
          inkscape:version=""1.0 (4035a4fb49, 2020-05-01)""
          id=""svg8""
          version=""1.1""
          viewBox=""0 0 389.58755 112.00001""
          height=""200px""
          width=""400px""
        >
          <defs id=""defs2"">
            <rect
              x=""198.314""
              y=""219.16101""
              width=""202.5903""
              height=""179.07059""
              id=""rect27""
            />
            <inkscape:path-effect
              only_selected=""false""
              apply_with_weight=""true""
              apply_no_weight=""true""
              helper_size=""0""
              steps=""2""
              weight=""33.333333""
              lpeversion=""1""
              is_visible=""true""
              id=""path-effect85""
              effect=""bspline""
            />
          </defs>
          <sodipodi:namedview
            fit-margin-bottom=""0""
            fit-margin-right=""0""
            fit-margin-left=""0""
            fit-margin-top=""0""
            inkscape:window-maximized=""1""
            inkscape:window-y=""-8""
            inkscape:window-x=""-8""
            inkscape:window-height=""1017""
            inkscape:window-width=""1920""
            showguides=""true""
            showgrid=""false""
            inkscape:document-rotation=""0""
            inkscape:current-layer=""layer1""
            inkscape:document-units=""mm""
            inkscape:cy=""-385.05649""
            inkscape:cx=""596.61331""
            inkscape:zoom=""0.35""
            inkscape:pageshadow=""2""
            inkscape:pageopacity=""0.0""
            borderopacity=""1.0""
            bordercolor=""#666666""
            pagecolor=""#ffffff""
            id=""base""
          />
          <metadata id=""metadata5"">
            <rdf:RDF>
              <cc:Work rdf:about="""">
                <dc:format>image/svg+xml</dc:format>
                <dc:type
                  rdf:resource=""http://purl.org/dc/dcmitype/StillImage""
                />
                <dc:title></dc:title>
              </cc:Work>
            </rdf:RDF>
          </metadata>
          <g
            transform=""translate(-55.206222,-71.999997)""
            id=""layer1""
            inkscape:groupmode=""layer""
            inkscape:label=""Lag 1""
          >
            <path
              transform=""matrix(0.26458333,0,0,0.26458333,55.206222,71.999997)""
              d=""M 113.38672 0 L 113.38672 113.38672 L 113.38672 226.77148 L 226.77344 226.77148 L 226.77344 113.38672 L 340.1582 113.38672 L 340.1582 0 L 226.77344 0 L 113.38672 0 z ""
              style=""fill: #000000; fill-rule: evenodd; stroke-width: 0.999999""
              id=""rect10""
            />
            <path
              id=""rect10-5""
              style=""fill: #4d4d4d; fill-rule: evenodd; stroke-width: 0.264583""
              d=""m 145.20646,71.999997 h 30 V 102 h -30 z""
            />
            <path
              id=""rect10-4""
              style=""fill: #ff7f2a; fill-rule: evenodd; stroke-width: 0.226575""
              d=""m 115.20647,102 h 29.99999 v 22 h -29.99999 z""
            />
            <path
              transform=""matrix(0.26458333,0,0,0.26458333,55.206222,71.999997)""
              d=""M 340.1582 113.38672 L 340.1582 226.77148 L 340.1582 340.1582 L 453.54492 340.1582 L 453.54492 226.77148 L 453.54492 113.38672 L 340.1582 113.38672 z ""
              style=""fill: #000000; fill-rule: evenodd; stroke-width: 0.999999""
              id=""rect10-58""
            />
            <path
              id=""rect10-0""
              style=""fill: #999999; fill-rule: evenodd; stroke-width: 0.264583""
              d=""m 85.206461,132 h 29.999999 v 30 H 85.206461 Z""
            />
            <path
              id=""rect10-41""
              style=""fill: #cccccc; fill-rule: evenodd; stroke-width: 0.297778""
              d=""m 115.20647,124 h 29.99999 v 38 h -29.99999 z""
            />
            <path
              id=""rect10-9""
              style=""fill: #ff7f2a; fill-rule: evenodd; stroke-width: 0.226575""
              d=""m 85.206461,162 h 29.999999 v 22 H 85.206461 Z""
            />
            <path
              id=""rect10-7""
              style=""fill: #ffcc00; fill-rule: evenodd; stroke-width: 0.226575""
              d=""m 145.20647,162 h 30 v 22 h -30 z""
            />
            <path
              d=""m 55.206222,102 a 30,30 0 0 0 30.000236,29.99972 V 102 Z""
              style=""fill: #cccccc; stroke-width: 0.264583""
              id=""path87""
            />
            <path
              id=""path87-8""
              style=""fill: #808080; stroke-width: 0.264583""
              d=""m 205.2067,102 a 30.000001,30.000001 0 0 1 -30.00024,29.99972 V 102 Z""
            />
            <g
              style=""
                font-style: normal;
                font-weight: normal;
                font-size: 62.4417px;
                line-height: 1.25;
                font-family: sans-serif;
                fill: #000000;
                fill-opacity: 1;
                stroke: none;
                stroke-width: 0.264583;
              ""
              id=""text146""
              aria-label=""Imguin""
            >
              <path
                id=""path902""
                style=""fill: #ff7f2a""
                d=""m 215.66006,103.05454 h 12.36345 v 43.70919 h -12.36345 z""
              />
              <path
                id=""path904""
                style=""fill: #ff7f2a""
                d=""m 280.40234,112.35836 q 6.24417,0 9.92823,3.7465 3.74651,3.7465 3.74651,11.30195 v 19.35692 H 282.21315 V 129.3425 q 0,-3.55918 -1.37371,-5.2451 -1.31128,-1.68593 -3.74651,-1.68593 -2.68499,0 -4.30847,1.87325 -1.62349,1.87325 -1.62349,5.6822 v 16.79681 H 259.29705 V 129.3425 q 0,-6.93103 -5.12022,-6.93103 -2.74744,0 -4.37092,1.87325 -1.62348,1.87325 -1.62348,5.6822 v 16.79681 H 236.3185 v -33.8434 h 11.30195 v 3.55918 q 1.87325,-2.06058 4.43336,-3.05964 2.62255,-1.06151 5.6822,-1.06151 3.55917,0 6.36905,1.31127 2.80988,1.31128 4.55824,3.99627 1.99814,-2.56011 5.05778,-3.93383 3.05964,-1.37371 6.68126,-1.37371 z""
              />
              <path
                id=""path906""
                style=""fill: #ff7f2a""
                d=""M 338.45654,112.92033 V 140.582 q 0,9.4287 -5.12022,14.11183 -5.12022,4.74557 -14.73624,4.74557 -4.99533,0 -9.36625,-1.12395 -4.37092,-1.12395 -7.43057,-3.30941 l 4.30848,-8.30475 q 2.06058,1.68593 5.18266,2.62255 3.18453,0.99907 6.24417,0.99907 4.68313,0 6.86859,-2.06058 2.18546,-2.06057 2.18546,-6.11928 v -1.12395 q -3.43429,3.99627 -10.05311,3.99627 -4.49581,0 -8.30475,-1.99814 -3.80894,-2.06058 -6.05685,-5.74464 -2.2479,-3.7465 -2.2479,-8.61695 0,-4.80801 2.2479,-8.49207 2.24791,-3.7465 6.05685,-5.74464 3.80894,-2.06057 8.30475,-2.06057 7.24323,0 10.61508,4.68312 v -4.12115 z m -19.10716,22.66634 q 3.18453,0 5.2451,-1.93569 2.12302,-1.9357 2.12302,-4.99534 0,-3.05964 -2.06057,-4.93289 -2.06058,-1.9357 -5.30755,-1.9357 -3.24697,0 -5.36998,1.9357 -2.06058,1.87325 -2.06058,4.93289 0,3.05964 2.12302,4.99534 2.12302,1.93569 5.30754,1.93569 z""
              />
              <path
                id=""path908""
                style=""
                  font-style: normal;
                  font-variant: normal;
                  font-weight: 800;
                  font-stretch: normal;
                  font-size: 62.4417px;
                  font-family: Montserrat;
                  -inkscape-font-specification: 'Montserrat Ultra-Bold';
                  stroke-width: 0.264583;
                ""
                d=""m 381.67108,112.92033 v 33.8434 h -11.30194 v -3.62162 q -1.87326,2.06058 -4.49581,3.12209 -2.62255,1.06151 -5.55731,1.06151 -6.55638,0 -10.4902,-3.87139 -3.87139,-3.87138 -3.87139,-11.61415 v -18.91984 h 11.86392 v 16.98414 q 0,3.80895 1.43616,5.55732 1.43616,1.74836 4.1836,1.74836 2.80987,0 4.55824,-1.93569 1.81081,-1.99813 1.81081,-6.05684 v -16.29729 z""
              />
              <path
                id=""path910""
                style=""
                  font-style: normal;
                  font-variant: normal;
                  font-weight: 800;
                  font-stretch: normal;
                  font-size: 62.4417px;
                  font-family: Montserrat;
                  -inkscape-font-specification: 'Montserrat Ultra-Bold';
                  stroke-width: 0.264583;
                ""
                d=""m 389.25189,112.92033 h 11.86392 v 33.8434 h -11.86392 z m 5.93196,-3.7465 q -3.24697,0 -5.2451,-1.81081 -1.99813,-1.81081 -1.99813,-4.4958 0,-2.685 1.99813,-4.495805 1.99813,-1.810809 5.2451,-1.810809 3.24697,0 5.24511,1.748368 1.99813,1.685926 1.99813,4.370916 0,2.80988 -1.99813,4.68313 -1.99814,1.81081 -5.24511,1.81081 z""
              />
              <path
                id=""path912""
                style=""
                  font-style: normal;
                  font-variant: normal;
                  font-weight: 800;
                  font-stretch: normal;
                  font-size: 62.4417px;
                  font-family: Montserrat;
                  -inkscape-font-specification: 'Montserrat Ultra-Bold';
                  stroke-width: 0.264583;
                ""
                d=""m 430.80684,112.35836 q 6.30661,0 10.11556,3.7465 3.87138,3.7465 3.87138,11.30195 v 19.35692 H 432.92986 V 129.3425 q 0,-6.93103 -5.55731,-6.93103 -3.05964,0 -4.9329,1.99813 -1.8108,1.99814 -1.8108,5.99441 v 16.35972 h -11.86393 v -33.8434 h 11.30195 v 3.68406 q 1.99813,-2.06057 4.74557,-3.12208 2.74743,-1.12395 5.9944,-1.12395 z""
              />
            </g>
            <text
              xml:space=""preserve""
              id=""text25""
              style=""
                font-style: normal;
                font-weight: normal;
                font-size: 10.5833px;
                line-height: 1.25;
                font-family: sans-serif;
                white-space: pre;
                shape-inside: url(#rect27);
                fill: #000000;
                fill-opacity: 1;
                stroke: none;
              ""
            />
          </g>
        </svg>
      </div>
      <div
        style=""
          font-family: Arial, Helvetica, sans-serif;
          padding: 20px;
          width: 100%;
          max-width: 90ch;
          border-left: 1px solid #2b3b41;
          border-right: 1px solid #2b3b41;
        ""
      >
        <h1>Welcome to Imguin</h1>
        <p>Please click <a href=""{confirmationUrl}"">here</a> to confirm your email</p>
      </div>
    </div>
  </body>
</html>";
        }
    }
}