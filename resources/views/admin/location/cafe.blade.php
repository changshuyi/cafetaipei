<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0">
        <title>Travelplan alpha</title>
        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
        <!-- bootstrap css -->
        <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
            crossorigin="anonymous"
        />
        <!-- 用bootswatch的模板 -->
        <link rel="stylesheet" href="https://bootswatch.com/4/darkly/bootstrap.min.css" crossorigin="anonymous"/>
    </head>
    <body>
        <div id="mapWrapper" class="mapWrapper"></div>
        <script>
            const APP_URL = '{{ env('APP_URL') }}';
            const GOOGLE_MAPS_API_KEY = '{{ env('GOOGLE_MAPS_API_KEY') }}';
        </script>
        <script src="{{asset('js/CafeTaipei.js')}}"></script>
    </body>
</html>