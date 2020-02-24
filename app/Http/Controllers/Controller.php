<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

use Illuminate\Http\Request;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    // get用
    public function getRequestV2($getData, $apiURL){
        // print_r($getData);
        // die();
        if (empty($getData)) {
           	$buildGet = '';
	    } else{
			$buildGet =preg_replace('/(%5B)\d+(%5D=)/i', '$1$2', http_build_query($getData));
        }
        // run curl
        $ch = curl_init($apiURL.'?'.$buildGet);      
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // curl_setopt($ch, CURLOPT_USERAGENT, $agent);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: text/html',
            // 'Authorization: basic ' . $accessToken
        ]);
        $apiResult = curl_exec($ch);
        // $apiResult=substr($apiResult, 11, -1);//因為現在是jsonp
        curl_close($ch);
        $result = json_decode($apiResult);
        return $result;
    }

    public function search(Request $request){
        //目前還沒有參數先預留
        $ResultInfo = $this->getRequestV2([], env('SEARCH_API'));
       
        // echo json_encode($ResultInfo);
        if (isset($ResultInfo->hits->hits)) {
            echo json_encode($ResultInfo->hits->hits);
        } else {
            echo json_encode([]);
        }
    }
}
