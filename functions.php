<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;

// BEGIN ENQUEUE PARENT ACTION
// AUTO GENERATED - Do not modify or remove comment markers above or below:

if ( !function_exists( 'chld_thm_cfg_locale_css' ) ):
    function chld_thm_cfg_locale_css( $uri ){
        if ( empty( $uri ) && is_rtl() && file_exists( get_template_directory() . '/rtl.css' ) )
            $uri = get_template_directory_uri() . '/rtl.css';
        return $uri;
    }
    
endif;

function bootstrap_enqueue_scripts() {
	if(is_page(array(2497, 2734, 3828, 3859))){
        wp_enqueue_style( 'bootstrap', get_stylesheet_directory_uri() . '/css/bootstrap.min.css');
        wp_enqueue_style( 'fontawesome', 'https://pro.fontawesome.com/releases/v5.10.0/css/all.css');
        wp_enqueue_style( 'bootstrap-icon', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css');
        wp_enqueue_style( 'bootstrapvue', "//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.css");

        wp_enqueue_script( 'bootstrap', get_stylesheet_directory_uri() . '/js/bootstrap.bundle.min.js');
        wp_enqueue_script( 'lodash-new', get_stylesheet_directory_uri() . '/js/lodash.js');
        wp_enqueue_script( 'vuejs', get_stylesheet_directory_uri() . '/js/vue.js');
        wp_enqueue_script( 'vuex', get_stylesheet_directory_uri() . '/js/vuex.js');
        wp_enqueue_script( 'Sortable', get_stylesheet_directory_uri() . '/js/Sortable.js');
        wp_enqueue_script( 'vuedraggable', get_stylesheet_directory_uri() . '/js/vuedraggable.min.js');
        wp_enqueue_script( 'sweetalert', 'https://unpkg.com/sweetalert/dist/sweetalert.min.js');
        wp_enqueue_script( 'bootstrapvue', "//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.js");
        wp_enqueue_script( 'easychat', get_stylesheet_directory_uri() . '/js/easy-chat.js', '', '', true);
    }
    // developer gui
    if(is_page(array(2497))){
        wp_enqueue_style( 'easydialog', get_stylesheet_directory_uri() . '/css/easy-dialog.css');
        wp_enqueue_script( 'easydialog', get_stylesheet_directory_uri() . '/js/easy-dialog.js', 'vuejs', '', true);
    }
    // noiman gui
    if(is_page(array(2734))){
        wp_enqueue_style( 'easydialog', get_stylesheet_directory_uri() . '/css/easy-dialog.css');
        wp_enqueue_script( 'easydialog', get_stylesheet_directory_uri() . '/js/easy-dialog-staging.js', 'vuejs', '', true);
    }
    // andres gui
    if(is_page(array(3828))){
        wp_enqueue_style( 'easydialog', get_stylesheet_directory_uri() . '/css/easy-dialog.css');
        // wp_enqueue_script( 'easydialog', get_stylesheet_directory_uri() . '/js/easy-dialog-staging-old.js', 'vuejs', '', true);
        wp_enqueue_script( 'easydialog', get_stylesheet_directory_uri() . '/js/easy-dialog-staging.js', 'vuejs', '', true);
    }
    // old bot loading page
    if(is_page(array(3859))){
        wp_enqueue_style( 'easydialog', get_stylesheet_directory_uri() . '/css/easy-dialog-old.css');
        wp_enqueue_script( 'easydialog', get_stylesheet_directory_uri() . '/js/easy-dialog-old-bot-loading.js', 'vuejs', '', true);
    }
    // easychat only page
    if(is_page(array(1898))){
        wp_enqueue_style( 'easydialog', get_stylesheet_directory_uri() . '/css/easy-dialog.css');
        wp_enqueue_script( 'easydialog', get_stylesheet_directory_uri() . '/js/easy-chat(demo).js', 'vuejs', '', true);
    }
    
}
add_action( 'wp_enqueue_scripts', 'bootstrap_enqueue_scripts' );

add_action( 'wp_enqueue_scripts', 'mywptheme_child_deregister_styles', 99 );
function mywptheme_child_deregister_styles() {
    wp_dequeue_style( '' ); 
}

add_filter( 'locale_stylesheet_uri', 'chld_thm_cfg_locale_css' );
// END ENQUEUE PARENT ACTION


/***** add custom functions *****/
add_filter( 'http_request_timeout', 'wp9838c_timeout_extend' );

function wp9838c_timeout_extend( $time )
{
    return 10;
}

function myCurl($url){
    if (isset($_POST['param']) && is_array($_POST['param'])) {    
        $param = wp_json_encode($_POST['param']);
                   
        $result = wp_remote_post( $url, array(
                'timeout' => 120,
                'redirection' => 5,
                'blocking' => true,
                //'headers'   => array('Content-Type' => 'application/json; charset=utf-8'),
                'body' => $param,
            )
        );

        if ( is_wp_error( $result ) ) {
            $error_message = $result->get_error_message();
            echo "Wordpress Error: $error_message";
            wp_die();
        } else {
            $body = wp_remote_retrieve_body( $result);
            $data = json_decode($body);
            wp_send_json($data);
        }
    }
}

add_action( 'wp_ajax_hello', 'blah_do_ajax_hello' );
add_action( 'wp_ajax_nopriv_hello', 'blah_do_ajax_hello' );

add_action( 'wp_ajax_save_bot', 'blah_do_ajax_hello' );
add_action( 'wp_ajax_nopriv_save_bot', 'blah_do_ajax_hello' );

add_action( 'wp_ajax_load_bot', 'blah_do_ajax_hello' );
add_action( 'wp_ajax_nopriv_load_bot', 'blah_do_ajax_hello' );

add_action( 'wp_ajax_bot_paid', 'blah_do_ajax_hello' );
add_action( 'wp_ajax_nopriv_bot_paid', 'blah_do_ajax_hello' );

add_action( 'wp_ajax_easyChat', 'blah_do_ajax_chatbot' );
add_action( 'wp_ajax_nopriv_easyChat', 'blah_do_ajax_chatbot' );

add_action( 'wp_ajax_androidapp', 'blah_do_ajax_chatbot' );
add_action( 'wp_ajax_nopriv_androidapp', 'blah_do_ajax_chatbot' );

add_action( 'wp_ajax_dispatch', 'blah_do_ajax_chatbot' );
add_action( 'wp_ajax_nopriv_dispatch', 'blah_do_ajax_chatbot' );

function blah_do_ajax_hello() {
	
    $url = 'https://1zjllk6s06.execute-api.us-east-1.amazonaws.com/test/effdia';

	if (isset($_POST['param']) && is_array($_POST['param'])) {
    	$json = $_POST['param'];	
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS,  json_encode($json));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        
        $result = curl_exec($ch);        
        curl_close($ch);
        
        echo json_decode($result);
        //wp_die($result);
	}
}



function blah_do_ajax_chatbot() {

	$url = 'https://t7m43auwfh.execute-api.us-east-1.amazonaws.com/test/DCSmulti';

	if (isset($_POST) && is_array($_POST)) {
    	$param = $_POST;
        // var_dump($param);
        // die();
        $result = wp_remote_post( $url, array(
                         'timeout' => 120,
                         'redirection' => 5,
                         'blocking' => true,
                //'headers'   => array('Content-Type' => 'application/json; charset=utf-8'),
                'body' => json_encode($param),
            )
        );

        if ( is_wp_error( $result ) ) {
            $error_message = $result->get_error_message();
            echo "Wordpress Error: $error_message";
            wp_die();
        } else {
            $body = wp_remote_retrieve_body( $result);
            $data = json_decode($body);
            //var_dump($data);
            wp_send_json($data);
        }
	}
}


// load_bot_dev
add_action( 'wp_ajax_load_bot_dev', 'ajax_func_dev' );
add_action( 'wp_ajax_nopriv_load_bot_dev', 'ajax_func_dev' );

// save_bot_dev
add_action( 'wp_ajax_save_bot_dev', 'ajax_func_dev' );
add_action( 'wp_ajax_nopriv_save_bot_dev', 'ajax_func_dev' );

// bot_paid_dev
add_action( 'wp_ajax_bot_paid_dev', 'ajax_func_dev' );
add_action( 'wp_ajax_nopriv_bot_paid_dev', 'ajax_func_dev' );

add_action( 'wp_ajax_build_bot_dev', 'ajax_func_dev' );
add_action( 'wp_ajax_nopriv_build_bot_dev', 'ajax_func_dev' );


function ajax_func_dev() {
    $url = 'https://a8e5l6o832.execute-api.us-east-1.amazonaws.com/test/LambdaBackendStaging';

	if (isset($_POST['param']) && is_array($_POST['param'])) {    
      	$param = wp_json_encode($_POST['param']);
                     
        $result = wp_remote_post( $url, array(
                'timeout' => 120,
                'redirection' => 5,
                'blocking' => true,
                 //'headers'   => array('Content-Type' => 'application/json; charset=utf-8'),
                'body' => $param,
            )
        );

        if ( is_wp_error( $result ) ) {
            $error_message = $result->get_error_message();
            echo "Wordpress Error: $error_message";
            wp_die();
        } else {
            $body = wp_remote_retrieve_body( $result);
            $data = json_decode($body);
            wp_send_json($data);
        }
    }
}


// Build Bot Async
add_action( 'wp_ajax_built_bot_async', 'buildBotAsync' );
add_action( 'wp_ajax_nopriv_built_bot_async', 'buildBotAsync' );

function buildBotAsync() {
    myCurl('https://1zjllk6s06.execute-api.us-east-1.amazonaws.com/test/async');
}

// Get Bot Key
add_action( 'wp_ajax_get_bot_key', 'getBotKey' );
add_action( 'wp_ajax_nopriv_get_bot_key', 'getBotKey' );

function getBotKey() {
    myCurl('https://a8e5l6o832.execute-api.us-east-1.amazonaws.com/test/chkbk');
}


// load_bot_dev_andreas
add_action( 'wp_ajax_load_bot_dev_andreas', 'ajax_func_dev_andreas' );
add_action( 'wp_ajax_nopriv_load_bot_dev_andreas', 'ajax_func_dev_andreas' );

// save_bot_dev_andreas
add_action( 'wp_ajax_save_bot_dev_andreas', 'ajax_func_dev_andreas' );
add_action( 'wp_ajax_nopriv_save_bot_dev_andreas', 'ajax_func_dev_andreas' );

// build_bot_dev_andreas
add_action( 'wp_ajax_build_bot_dev_andreas', 'ajax_func_dev_andreas' );
add_action( 'wp_ajax_nopriv_build_bot_dev_andreas', 'ajax_func_dev_andreas' );

// bot_paid_dev_andreas
add_action( 'wp_ajax_bot_paid_dev_andreas', 'ajax_func_dev_andreas' );
add_action( 'wp_ajax_nopriv_bot_paid_dev_andreas', 'ajax_func_dev_andreas' );


function ajax_func_dev_andreas() {
    $url = 'https://1zjllk6s06.execute-api.us-east-1.amazonaws.com/test/effdia';

	if (isset($_POST['param']) && is_array($_POST['param'])) {    
      	$param = wp_json_encode($_POST['param']);
                     
        $result = wp_remote_post( $url, array(
                'timeout' => 120,
                'redirection' => 5,
                'blocking' => true,
                'body' => $param,
            )
        );

        if ( is_wp_error( $result ) ) {
            $error_message = $result->get_error_message();
            echo "Wordpress Error: $error_message";
            wp_die();
        } else {
            $body = wp_remote_retrieve_body( $result);
            $data = json_decode($body);
            wp_send_json($data);
        }
    }
}
/*<< End of Yue*/