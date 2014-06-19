<?php

namespace Project\Controller;

use Symfony\Component\HttpFoundation\Response;

class Surebet extends Controller
{
    public function process()
    {
        $data     = $this->request->request->all();
        $response = array();
        
        $maximumAmount = $data['maximum_amount'];
        $sumInverse    = 0;
        
        foreach ( $data['cote'] as $cote ) {
            $sumInverse += 1/$cote;
        }
        
        $response['isSurebet'] = ($sumInverse < 1);
        
        if ( $response['isSurebet'] ) {
            $response['isSurebet'] = (int) $response['isSurebet'];
            $response['amounts']   = array();
        }
        
        foreach ( $data['cote'] as $i => $cote ) {
            $response['amounts'][$i] = number_format(round($maximumAmount/$cote, 2), 2);
        }
        
        return new Response(json_encode($response));
    }
}