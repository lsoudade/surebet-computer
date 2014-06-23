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
            $response['isSurebet']     = (int) $response['isSurebet'];
            $response['sumInverse']    = number_format(round($sumInverse, 2), 2);
            $response['percentAmount'] = number_format(round(((1 - $sumInverse) * 100), 2), 2) . '%';
            $response['globalAmount']  = 0;
            $response['amounts']       = array();
            $response['revenues']      = array();
        }
        
        foreach ( $data['cote'] as $i => $cote ) {
            $amount = number_format(round($maximumAmount/$cote, 2), 2);
            $response['globalAmount'] += $amount;
            $response['amounts'][$i]   = $amount;
        }
        
        foreach ( $data['cote'] as $i => $cote ) {
            $response['revenues'][$i] = $response['amounts'][$i] * $cote - $response['globalAmount'];
        }
        
        return new Response(json_encode($response));
    }
}
