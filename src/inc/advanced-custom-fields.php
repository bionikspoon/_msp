<?php
define( 'ACF_LITE', TRUE );

if ( function_exists( "register_field_group" ) ) {
   register_field_group( [
      'id'         => 'acf_project-meta',
      'title'      => 'Project Meta',
      'fields'     => [
         [
            'key'           => 'field_56f7209162bb3',
            'label'         => 'Read More',
            'name'          => 'read_more',
            'type'          => 'true_false',
            'instructions'  => 'Show "Read More" link.',
            'message'       => '',
            'default_value' => 1,
         ],
         [
            'key'           => 'field_56f6f4db64e69',
            'label'         => 'Source Link',
            'name'          => 'source_link',
            'type'          => 'text',
            'default_value' => '',
            'placeholder'   => 'https://github.com/user/project',
            'prepend'       => '',
            'append'        => '',
            'formatting'    => 'none',
            'maxlength'     => '',
         ],
         [
            'key'           => 'field_56f6f5a064e6a',
            'label'         => 'Live Link',
            'name'          => 'live_link',
            'type'          => 'text',
            'default_value' => '',
            'placeholder'   => 'https://',
            'prepend'       => '',
            'append'        => '',
            'formatting'    => 'none',
            'maxlength'     => '',
         ],
         [
            'key'           => 'field_56f7249195360',
            'label'         => 'Inlcude External Link',
            'name'          => 'include_external_link',
            'type'          => 'true_false',
            'message'       => '',
            'default_value' => 0,
         ],
         [
            'key'               => 'field_56f7231135d01',
            'label'             => 'External Link',
            'name'              => 'external_link',
            'type'              => 'text',
            'required'          => 1,
            'conditional_logic' => [
               'status'   => 1,
               'rules'    => [
                  [
                     'field'    => 'field_56f7249195360',
                     'operator' => '==',
                     'value'    => '1',
                  ],
               ],
               'allorany' => 'all',
            ],
            'default_value'     => '',
            'placeholder'       => 'https://',
            'prepend'           => '',
            'append'            => '',
            'formatting'        => 'none',
            'maxlength'         => '',
         ],
         [
            'key'               => 'field_56f724139535f',
            'label'             => 'External Title',
            'name'              => 'external_title',
            'type'              => 'text',
            'required'          => 1,
            'conditional_logic' => [
               'status'   => 1,
               'rules'    => [
                  [
                     'field'    => 'field_56f7249195360',
                     'operator' => '==',
                     'value'    => '1',
                  ],
               ],
               'allorany' => 'all',
            ],
            'default_value'     => '',
            'placeholder'       => 'PyPI',
            'prepend'           => '',
            'append'            => '',
            'formatting'        => 'none',
            'maxlength'         => '',
         ],
      ],
      'location'   => [
         [
            [
               'param'    => 'post_type',
               'operator' => '==',
               'value'    => 'jetpack-portfolio',
               'order_no' => 0,
               'group_no' => 0,
            ],
         ],
      ],
      'options'    => [
         'position'       => 'normal',
         'layout'         => 'no_box',
         'hide_on_screen' => [
         ],
      ],
      'menu_order' => 0,
   ] );
}

