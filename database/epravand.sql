PGDMP     .                    |            epravand    15.4    15.4 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16515    epravand    DATABASE     {   CREATE DATABASE epravand WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
    DROP DATABASE epravand;
                postgres    false            �            1259    16556    coordinator_detail    TABLE       CREATE TABLE public.coordinator_detail (
    coordinator_id integer NOT NULL,
    user_id integer NOT NULL,
    is_approved boolean DEFAULT false,
    is_disabled boolean DEFAULT false,
    registered_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 &   DROP TABLE public.coordinator_detail;
       public         heap    postgres    false            �            1259    16555 %   coordinator_detail_coordinator_id_seq    SEQUENCE     �   CREATE SEQUENCE public.coordinator_detail_coordinator_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.coordinator_detail_coordinator_id_seq;
       public          postgres    false    221            �           0    0 %   coordinator_detail_coordinator_id_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.coordinator_detail_coordinator_id_seq OWNED BY public.coordinator_detail.coordinator_id;
          public          postgres    false    220            �            1259    16641    course    TABLE     �   CREATE TABLE public.course (
    course_id integer NOT NULL,
    department_id integer NOT NULL,
    course_name character varying(100) NOT NULL
);
    DROP TABLE public.course;
       public         heap    postgres    false            �            1259    16640    course_course_id_seq    SEQUENCE     �   CREATE SEQUENCE public.course_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.course_course_id_seq;
       public          postgres    false    233            �           0    0    course_course_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.course_course_id_seq OWNED BY public.course.course_id;
          public          postgres    false    232            �            1259    16632 
   department    TABLE     |   CREATE TABLE public.department (
    department_id integer NOT NULL,
    department_name character varying(100) NOT NULL
);
    DROP TABLE public.department;
       public         heap    postgres    false            �            1259    16631    department_department_id_seq    SEQUENCE     �   CREATE SEQUENCE public.department_department_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.department_department_id_seq;
       public          postgres    false    231            �           0    0    department_department_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.department_department_id_seq OWNED BY public.department.department_id;
          public          postgres    false    230            �            1259    16580    event    TABLE     �  CREATE TABLE public.event (
    event_id integer NOT NULL,
    coordinator_id integer NOT NULL,
    type_id integer NOT NULL,
    title character varying(50) NOT NULL,
    description text,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    venue character varying(255),
    participant_strength integer,
    file_path text[],
    is_approved boolean
);
    DROP TABLE public.event;
       public         heap    postgres    false            �            1259    16579    event_event_id_seq    SEQUENCE     �   CREATE SEQUENCE public.event_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.event_event_id_seq;
       public          postgres    false    225            �           0    0    event_event_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.event_event_id_seq OWNED BY public.event.event_id;
          public          postgres    false    224            �            1259    16688    event_participant    TABLE     �   CREATE TABLE public.event_participant (
    event_participant_id integer NOT NULL,
    event_id integer NOT NULL,
    participant_id integer NOT NULL,
    registered_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 %   DROP TABLE public.event_participant;
       public         heap    postgres    false            �            1259    16687 *   event_participant_event_participant_id_seq    SEQUENCE     �   CREATE SEQUENCE public.event_participant_event_participant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE public.event_participant_event_participant_id_seq;
       public          postgres    false    239            �           0    0 *   event_participant_event_participant_id_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.event_participant_event_participant_id_seq OWNED BY public.event_participant.event_participant_id;
          public          postgres    false    238            �            1259    16571 
   event_type    TABLE     v   CREATE TABLE public.event_type (
    event_type_id integer NOT NULL,
    type_name character varying(100) NOT NULL
);
    DROP TABLE public.event_type;
       public         heap    postgres    false            �            1259    16570    event_type_event_type_id_seq    SEQUENCE     �   CREATE SEQUENCE public.event_type_event_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.event_type_event_type_id_seq;
       public          postgres    false    223            �           0    0    event_type_event_type_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.event_type_event_type_id_seq OWNED BY public.event_type.event_type_id;
          public          postgres    false    222            �            1259    16725    institution    TABLE     �   CREATE TABLE public.institution (
    institution_id integer NOT NULL,
    institution_name character varying(255) NOT NULL,
    type character varying(100) NOT NULL
);
    DROP TABLE public.institution;
       public         heap    postgres    false            �            1259    16724    institution_institution_id_seq    SEQUENCE     �   CREATE SEQUENCE public.institution_institution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.institution_institution_id_seq;
       public          postgres    false    243            �           0    0    institution_institution_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.institution_institution_id_seq OWNED BY public.institution.institution_id;
          public          postgres    false    242            �            1259    16653    participant    TABLE     ~  CREATE TABLE public.participant (
    participant_id integer NOT NULL,
    participant_type_id integer NOT NULL,
    course_id integer NOT NULL,
    name character varying(100) NOT NULL,
    reg_no character varying(50),
    gender character(1),
    dob date,
    email character varying(100),
    phone character varying(15),
    is_approved boolean,
    institution_id integer
);
    DROP TABLE public.participant;
       public         heap    postgres    false            �            1259    16652    participant_participant_id_seq    SEQUENCE     �   CREATE SEQUENCE public.participant_participant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.participant_participant_id_seq;
       public          postgres    false    235            �           0    0    participant_participant_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.participant_participant_id_seq OWNED BY public.participant.participant_id;
          public          postgres    false    234            �            1259    16623    participant_type    TABLE     �   CREATE TABLE public.participant_type (
    participant_type_id integer NOT NULL,
    type_name character varying(100) NOT NULL
);
 $   DROP TABLE public.participant_type;
       public         heap    postgres    false            �            1259    16622 (   participant_type_participant_type_id_seq    SEQUENCE     �   CREATE SEQUENCE public.participant_type_participant_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.participant_type_participant_type_id_seq;
       public          postgres    false    229            �           0    0 (   participant_type_participant_type_id_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.participant_type_participant_type_id_seq OWNED BY public.participant_type.participant_type_id;
          public          postgres    false    228            �            1259    16530    role    TABLE     i   CREATE TABLE public.role (
    role_id integer NOT NULL,
    role_name character varying(50) NOT NULL
);
    DROP TABLE public.role;
       public         heap    postgres    false            �            1259    16529    role_role_id_seq    SEQUENCE     �   CREATE SEQUENCE public.role_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.role_role_id_seq;
       public          postgres    false    217            �           0    0    role_role_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.role_role_id_seq OWNED BY public.role.role_id;
          public          postgres    false    216            �            1259    16599 	   sub_event    TABLE     o  CREATE TABLE public.sub_event (
    sub_event_id integer NOT NULL,
    event_id integer NOT NULL,
    coordinator_id integer NOT NULL,
    type_id integer,
    title character varying(50),
    description text,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    venue character varying(255),
    participant_strength integer
);
    DROP TABLE public.sub_event;
       public         heap    postgres    false            �            1259    16706    sub_event_participant    TABLE     �   CREATE TABLE public.sub_event_participant (
    sub_event_participant_id integer NOT NULL,
    event_participant_id integer NOT NULL,
    sub_event_id integer NOT NULL
);
 )   DROP TABLE public.sub_event_participant;
       public         heap    postgres    false            �            1259    16705 2   sub_event_participant_sub_event_participant_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sub_event_participant_sub_event_participant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 I   DROP SEQUENCE public.sub_event_participant_sub_event_participant_id_seq;
       public          postgres    false    241            �           0    0 2   sub_event_participant_sub_event_participant_id_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.sub_event_participant_sub_event_participant_id_seq OWNED BY public.sub_event_participant.sub_event_participant_id;
          public          postgres    false    240            �            1259    16598    sub_event_sub_event_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sub_event_sub_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.sub_event_sub_event_id_seq;
       public          postgres    false    227            �           0    0    sub_event_sub_event_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.sub_event_sub_event_id_seq OWNED BY public.sub_event.sub_event_id;
          public          postgres    false    226            �            1259    16517    user_account    TABLE       CREATE TABLE public.user_account (
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(15),
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL
);
     DROP TABLE public.user_account;
       public         heap    postgres    false            �            1259    16516    user_account_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_account_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.user_account_user_id_seq;
       public          postgres    false    215            �           0    0    user_account_user_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.user_account_user_id_seq OWNED BY public.user_account.user_id;
          public          postgres    false    214            �            1259    16539 	   user_role    TABLE     �   CREATE TABLE public.user_role (
    user_role_id integer NOT NULL,
    user_id integer NOT NULL,
    role_id integer NOT NULL
);
    DROP TABLE public.user_role;
       public         heap    postgres    false            �            1259    16538    user_role_user_role_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_role_user_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.user_role_user_role_id_seq;
       public          postgres    false    219            �           0    0    user_role_user_role_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.user_role_user_role_id_seq OWNED BY public.user_role.user_role_id;
          public          postgres    false    218            �            1259    16671 	   volunteer    TABLE     
  CREATE TABLE public.volunteer (
    volunteer_id integer NOT NULL,
    event_id integer NOT NULL,
    course_id integer,
    name character varying(100) NOT NULL,
    reg_no character varying(50),
    email character varying(100),
    phone character varying(15)
);
    DROP TABLE public.volunteer;
       public         heap    postgres    false            �            1259    16670    volunteer_volunteer_id_seq    SEQUENCE     �   CREATE SEQUENCE public.volunteer_volunteer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.volunteer_volunteer_id_seq;
       public          postgres    false    237            �           0    0    volunteer_volunteer_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.volunteer_volunteer_id_seq OWNED BY public.volunteer.volunteer_id;
          public          postgres    false    236            �           2604    16559 !   coordinator_detail coordinator_id    DEFAULT     �   ALTER TABLE ONLY public.coordinator_detail ALTER COLUMN coordinator_id SET DEFAULT nextval('public.coordinator_detail_coordinator_id_seq'::regclass);
 P   ALTER TABLE public.coordinator_detail ALTER COLUMN coordinator_id DROP DEFAULT;
       public          postgres    false    220    221    221            �           2604    16644    course course_id    DEFAULT     t   ALTER TABLE ONLY public.course ALTER COLUMN course_id SET DEFAULT nextval('public.course_course_id_seq'::regclass);
 ?   ALTER TABLE public.course ALTER COLUMN course_id DROP DEFAULT;
       public          postgres    false    233    232    233            �           2604    16635    department department_id    DEFAULT     �   ALTER TABLE ONLY public.department ALTER COLUMN department_id SET DEFAULT nextval('public.department_department_id_seq'::regclass);
 G   ALTER TABLE public.department ALTER COLUMN department_id DROP DEFAULT;
       public          postgres    false    230    231    231            �           2604    16583    event event_id    DEFAULT     p   ALTER TABLE ONLY public.event ALTER COLUMN event_id SET DEFAULT nextval('public.event_event_id_seq'::regclass);
 =   ALTER TABLE public.event ALTER COLUMN event_id DROP DEFAULT;
       public          postgres    false    224    225    225            �           2604    16691 &   event_participant event_participant_id    DEFAULT     �   ALTER TABLE ONLY public.event_participant ALTER COLUMN event_participant_id SET DEFAULT nextval('public.event_participant_event_participant_id_seq'::regclass);
 U   ALTER TABLE public.event_participant ALTER COLUMN event_participant_id DROP DEFAULT;
       public          postgres    false    238    239    239            �           2604    16574    event_type event_type_id    DEFAULT     �   ALTER TABLE ONLY public.event_type ALTER COLUMN event_type_id SET DEFAULT nextval('public.event_type_event_type_id_seq'::regclass);
 G   ALTER TABLE public.event_type ALTER COLUMN event_type_id DROP DEFAULT;
       public          postgres    false    223    222    223            �           2604    16728    institution institution_id    DEFAULT     �   ALTER TABLE ONLY public.institution ALTER COLUMN institution_id SET DEFAULT nextval('public.institution_institution_id_seq'::regclass);
 I   ALTER TABLE public.institution ALTER COLUMN institution_id DROP DEFAULT;
       public          postgres    false    243    242    243            �           2604    16656    participant participant_id    DEFAULT     �   ALTER TABLE ONLY public.participant ALTER COLUMN participant_id SET DEFAULT nextval('public.participant_participant_id_seq'::regclass);
 I   ALTER TABLE public.participant ALTER COLUMN participant_id DROP DEFAULT;
       public          postgres    false    235    234    235            �           2604    16626 $   participant_type participant_type_id    DEFAULT     �   ALTER TABLE ONLY public.participant_type ALTER COLUMN participant_type_id SET DEFAULT nextval('public.participant_type_participant_type_id_seq'::regclass);
 S   ALTER TABLE public.participant_type ALTER COLUMN participant_type_id DROP DEFAULT;
       public          postgres    false    229    228    229            �           2604    16533    role role_id    DEFAULT     l   ALTER TABLE ONLY public.role ALTER COLUMN role_id SET DEFAULT nextval('public.role_role_id_seq'::regclass);
 ;   ALTER TABLE public.role ALTER COLUMN role_id DROP DEFAULT;
       public          postgres    false    217    216    217            �           2604    16602    sub_event sub_event_id    DEFAULT     �   ALTER TABLE ONLY public.sub_event ALTER COLUMN sub_event_id SET DEFAULT nextval('public.sub_event_sub_event_id_seq'::regclass);
 E   ALTER TABLE public.sub_event ALTER COLUMN sub_event_id DROP DEFAULT;
       public          postgres    false    227    226    227            �           2604    16709 .   sub_event_participant sub_event_participant_id    DEFAULT     �   ALTER TABLE ONLY public.sub_event_participant ALTER COLUMN sub_event_participant_id SET DEFAULT nextval('public.sub_event_participant_sub_event_participant_id_seq'::regclass);
 ]   ALTER TABLE public.sub_event_participant ALTER COLUMN sub_event_participant_id DROP DEFAULT;
       public          postgres    false    240    241    241            �           2604    16520    user_account user_id    DEFAULT     |   ALTER TABLE ONLY public.user_account ALTER COLUMN user_id SET DEFAULT nextval('public.user_account_user_id_seq'::regclass);
 C   ALTER TABLE public.user_account ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    215    214    215            �           2604    16542    user_role user_role_id    DEFAULT     �   ALTER TABLE ONLY public.user_role ALTER COLUMN user_role_id SET DEFAULT nextval('public.user_role_user_role_id_seq'::regclass);
 E   ALTER TABLE public.user_role ALTER COLUMN user_role_id DROP DEFAULT;
       public          postgres    false    218    219    219            �           2604    16674    volunteer volunteer_id    DEFAULT     �   ALTER TABLE ONLY public.volunteer ALTER COLUMN volunteer_id SET DEFAULT nextval('public.volunteer_volunteer_id_seq'::regclass);
 E   ALTER TABLE public.volunteer ALTER COLUMN volunteer_id DROP DEFAULT;
       public          postgres    false    236    237    237            �          0    16556    coordinator_detail 
   TABLE DATA           p   COPY public.coordinator_detail (coordinator_id, user_id, is_approved, is_disabled, registered_date) FROM stdin;
    public          postgres    false    221   ت       �          0    16641    course 
   TABLE DATA           G   COPY public.course (course_id, department_id, course_name) FROM stdin;
    public          postgres    false    233   ��       �          0    16632 
   department 
   TABLE DATA           D   COPY public.department (department_id, department_name) FROM stdin;
    public          postgres    false    231   ѫ       �          0    16580    event 
   TABLE DATA           �   COPY public.event (event_id, coordinator_id, type_id, title, description, start_date, end_date, venue, participant_strength, file_path, is_approved) FROM stdin;
    public          postgres    false    225   �       �          0    16688    event_participant 
   TABLE DATA           l   COPY public.event_participant (event_participant_id, event_id, participant_id, registered_date) FROM stdin;
    public          postgres    false    239   а       �          0    16571 
   event_type 
   TABLE DATA           >   COPY public.event_type (event_type_id, type_name) FROM stdin;
    public          postgres    false    223   8�       �          0    16725    institution 
   TABLE DATA           M   COPY public.institution (institution_id, institution_name, type) FROM stdin;
    public          postgres    false    243   ��       �          0    16653    participant 
   TABLE DATA           �   COPY public.participant (participant_id, participant_type_id, course_id, name, reg_no, gender, dob, email, phone, is_approved, institution_id) FROM stdin;
    public          postgres    false    235   �       �          0    16623    participant_type 
   TABLE DATA           J   COPY public.participant_type (participant_type_id, type_name) FROM stdin;
    public          postgres    false    229   ǲ       �          0    16530    role 
   TABLE DATA           2   COPY public.role (role_id, role_name) FROM stdin;
    public          postgres    false    217   ��       �          0    16599 	   sub_event 
   TABLE DATA           �   COPY public.sub_event (sub_event_id, event_id, coordinator_id, type_id, title, description, start_date, end_date, venue, participant_strength) FROM stdin;
    public          postgres    false    227   6�       �          0    16706    sub_event_participant 
   TABLE DATA           m   COPY public.sub_event_participant (sub_event_participant_id, event_participant_id, sub_event_id) FROM stdin;
    public          postgres    false    241   ��       �          0    16517    user_account 
   TABLE DATA           W   COPY public.user_account (user_id, name, email, phone, username, password) FROM stdin;
    public          postgres    false    215   ��       �          0    16539 	   user_role 
   TABLE DATA           C   COPY public.user_role (user_role_id, user_id, role_id) FROM stdin;
    public          postgres    false    219   ��       �          0    16671 	   volunteer 
   TABLE DATA           b   COPY public.volunteer (volunteer_id, event_id, course_id, name, reg_no, email, phone) FROM stdin;
    public          postgres    false    237   ٹ       �           0    0 %   coordinator_detail_coordinator_id_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.coordinator_detail_coordinator_id_seq', 10, true);
          public          postgres    false    220            �           0    0    course_course_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.course_course_id_seq', 7, true);
          public          postgres    false    232            �           0    0    department_department_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.department_department_id_seq', 4, true);
          public          postgres    false    230            �           0    0    event_event_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.event_event_id_seq', 39, true);
          public          postgres    false    224            �           0    0 *   event_participant_event_participant_id_seq    SEQUENCE SET     X   SELECT pg_catalog.setval('public.event_participant_event_participant_id_seq', 7, true);
          public          postgres    false    238            �           0    0    event_type_event_type_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.event_type_event_type_id_seq', 12, true);
          public          postgres    false    222            �           0    0    institution_institution_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.institution_institution_id_seq', 1, false);
          public          postgres    false    242            �           0    0    participant_participant_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.participant_participant_id_seq', 7, true);
          public          postgres    false    234            �           0    0 (   participant_type_participant_type_id_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.participant_type_participant_type_id_seq', 1, false);
          public          postgres    false    228            �           0    0    role_role_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.role_role_id_seq', 3, true);
          public          postgres    false    216            �           0    0 2   sub_event_participant_sub_event_participant_id_seq    SEQUENCE SET     `   SELECT pg_catalog.setval('public.sub_event_participant_sub_event_participant_id_seq', 3, true);
          public          postgres    false    240            �           0    0    sub_event_sub_event_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.sub_event_sub_event_id_seq', 54, true);
          public          postgres    false    226            �           0    0    user_account_user_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.user_account_user_id_seq', 15, true);
          public          postgres    false    214            �           0    0    user_role_user_role_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.user_role_user_role_id_seq', 15, true);
          public          postgres    false    218            �           0    0    volunteer_volunteer_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.volunteer_volunteer_id_seq', 3, true);
          public          postgres    false    236            �           2606    16564 *   coordinator_detail coordinator_detail_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.coordinator_detail
    ADD CONSTRAINT coordinator_detail_pkey PRIMARY KEY (coordinator_id);
 T   ALTER TABLE ONLY public.coordinator_detail DROP CONSTRAINT coordinator_detail_pkey;
       public            postgres    false    221            �           2606    16646    course course_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (course_id);
 <   ALTER TABLE ONLY public.course DROP CONSTRAINT course_pkey;
       public            postgres    false    233            �           2606    16639 )   department department_department_name_key 
   CONSTRAINT     o   ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_department_name_key UNIQUE (department_name);
 S   ALTER TABLE ONLY public.department DROP CONSTRAINT department_department_name_key;
       public            postgres    false    231            �           2606    16637    department department_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (department_id);
 D   ALTER TABLE ONLY public.department DROP CONSTRAINT department_pkey;
       public            postgres    false    231            �           2606    16694 (   event_participant event_participant_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.event_participant
    ADD CONSTRAINT event_participant_pkey PRIMARY KEY (event_participant_id);
 R   ALTER TABLE ONLY public.event_participant DROP CONSTRAINT event_participant_pkey;
       public            postgres    false    239            �           2606    16587    event event_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (event_id);
 :   ALTER TABLE ONLY public.event DROP CONSTRAINT event_pkey;
       public            postgres    false    225            �           2606    16576    event_type event_type_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.event_type
    ADD CONSTRAINT event_type_pkey PRIMARY KEY (event_type_id);
 D   ALTER TABLE ONLY public.event_type DROP CONSTRAINT event_type_pkey;
       public            postgres    false    223            �           2606    16578 #   event_type event_type_type_name_key 
   CONSTRAINT     c   ALTER TABLE ONLY public.event_type
    ADD CONSTRAINT event_type_type_name_key UNIQUE (type_name);
 M   ALTER TABLE ONLY public.event_type DROP CONSTRAINT event_type_type_name_key;
       public            postgres    false    223            �           2606    16730    institution institution_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.institution
    ADD CONSTRAINT institution_pkey PRIMARY KEY (institution_id);
 F   ALTER TABLE ONLY public.institution DROP CONSTRAINT institution_pkey;
       public            postgres    false    243            �           2606    16659    participant participant_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_pkey PRIMARY KEY (participant_id);
 F   ALTER TABLE ONLY public.participant DROP CONSTRAINT participant_pkey;
       public            postgres    false    235            �           2606    16628 &   participant_type participant_type_pkey 
   CONSTRAINT     u   ALTER TABLE ONLY public.participant_type
    ADD CONSTRAINT participant_type_pkey PRIMARY KEY (participant_type_id);
 P   ALTER TABLE ONLY public.participant_type DROP CONSTRAINT participant_type_pkey;
       public            postgres    false    229            �           2606    16630 /   participant_type participant_type_type_name_key 
   CONSTRAINT     o   ALTER TABLE ONLY public.participant_type
    ADD CONSTRAINT participant_type_type_name_key UNIQUE (type_name);
 Y   ALTER TABLE ONLY public.participant_type DROP CONSTRAINT participant_type_type_name_key;
       public            postgres    false    229            �           2606    16535    role role_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (role_id);
 8   ALTER TABLE ONLY public.role DROP CONSTRAINT role_pkey;
       public            postgres    false    217            �           2606    16537    role role_role_name_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_role_name_key UNIQUE (role_name);
 A   ALTER TABLE ONLY public.role DROP CONSTRAINT role_role_name_key;
       public            postgres    false    217            �           2606    16711 0   sub_event_participant sub_event_participant_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.sub_event_participant
    ADD CONSTRAINT sub_event_participant_pkey PRIMARY KEY (sub_event_participant_id);
 Z   ALTER TABLE ONLY public.sub_event_participant DROP CONSTRAINT sub_event_participant_pkey;
       public            postgres    false    241            �           2606    16606    sub_event sub_event_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.sub_event
    ADD CONSTRAINT sub_event_pkey PRIMARY KEY (sub_event_id);
 B   ALTER TABLE ONLY public.sub_event DROP CONSTRAINT sub_event_pkey;
       public            postgres    false    227            �           2606    16526 #   user_account user_account_email_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_email_key UNIQUE (email);
 M   ALTER TABLE ONLY public.user_account DROP CONSTRAINT user_account_email_key;
       public            postgres    false    215            �           2606    16524    user_account user_account_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_pkey PRIMARY KEY (user_id);
 H   ALTER TABLE ONLY public.user_account DROP CONSTRAINT user_account_pkey;
       public            postgres    false    215            �           2606    16528 &   user_account user_account_username_key 
   CONSTRAINT     e   ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_username_key UNIQUE (username);
 P   ALTER TABLE ONLY public.user_account DROP CONSTRAINT user_account_username_key;
       public            postgres    false    215            �           2606    16544    user_role user_role_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (user_role_id);
 B   ALTER TABLE ONLY public.user_role DROP CONSTRAINT user_role_pkey;
       public            postgres    false    219            �           2606    16676    volunteer volunteer_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.volunteer
    ADD CONSTRAINT volunteer_pkey PRIMARY KEY (volunteer_id);
 B   ALTER TABLE ONLY public.volunteer DROP CONSTRAINT volunteer_pkey;
       public            postgres    false    237            �           2606    16565 2   coordinator_detail coordinator_detail_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.coordinator_detail
    ADD CONSTRAINT coordinator_detail_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_account(user_id);
 \   ALTER TABLE ONLY public.coordinator_detail DROP CONSTRAINT coordinator_detail_user_id_fkey;
       public          postgres    false    215    221    3265            �           2606    16647     course course_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.department(department_id);
 J   ALTER TABLE ONLY public.course DROP CONSTRAINT course_department_id_fkey;
       public          postgres    false    231    3291    233            �           2606    16588    event event_coordinator_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_coordinator_id_fkey FOREIGN KEY (coordinator_id) REFERENCES public.coordinator_detail(coordinator_id);
 I   ALTER TABLE ONLY public.event DROP CONSTRAINT event_coordinator_id_fkey;
       public          postgres    false    221    3275    225            �           2606    16695 1   event_participant event_participant_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.event_participant
    ADD CONSTRAINT event_participant_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(event_id);
 [   ALTER TABLE ONLY public.event_participant DROP CONSTRAINT event_participant_event_id_fkey;
       public          postgres    false    239    3281    225            �           2606    16700 7   event_participant event_participant_participant_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.event_participant
    ADD CONSTRAINT event_participant_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES public.participant(participant_id);
 a   ALTER TABLE ONLY public.event_participant DROP CONSTRAINT event_participant_participant_id_fkey;
       public          postgres    false    239    3295    235            �           2606    16593    event event_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.event_type(event_type_id);
 B   ALTER TABLE ONLY public.event DROP CONSTRAINT event_type_id_fkey;
       public          postgres    false    225    3277    223            �           2606    16731    participant fk_institution    FK CONSTRAINT     �   ALTER TABLE ONLY public.participant
    ADD CONSTRAINT fk_institution FOREIGN KEY (institution_id) REFERENCES public.institution(institution_id);
 D   ALTER TABLE ONLY public.participant DROP CONSTRAINT fk_institution;
       public          postgres    false    3303    235    243            �           2606    16665 &   participant participant_course_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(course_id);
 P   ALTER TABLE ONLY public.participant DROP CONSTRAINT participant_course_id_fkey;
       public          postgres    false    235    233    3293            �           2606    16660 0   participant participant_participant_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_participant_type_id_fkey FOREIGN KEY (participant_type_id) REFERENCES public.participant_type(participant_type_id);
 Z   ALTER TABLE ONLY public.participant DROP CONSTRAINT participant_participant_type_id_fkey;
       public          postgres    false    235    3285    229            �           2606    16612 '   sub_event sub_event_coordinator_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sub_event
    ADD CONSTRAINT sub_event_coordinator_id_fkey FOREIGN KEY (coordinator_id) REFERENCES public.coordinator_detail(coordinator_id);
 Q   ALTER TABLE ONLY public.sub_event DROP CONSTRAINT sub_event_coordinator_id_fkey;
       public          postgres    false    221    3275    227            �           2606    16607 !   sub_event sub_event_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sub_event
    ADD CONSTRAINT sub_event_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(event_id);
 K   ALTER TABLE ONLY public.sub_event DROP CONSTRAINT sub_event_event_id_fkey;
       public          postgres    false    227    3281    225            �           2606    16712 E   sub_event_participant sub_event_participant_event_participant_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sub_event_participant
    ADD CONSTRAINT sub_event_participant_event_participant_id_fkey FOREIGN KEY (event_participant_id) REFERENCES public.event_participant(event_participant_id);
 o   ALTER TABLE ONLY public.sub_event_participant DROP CONSTRAINT sub_event_participant_event_participant_id_fkey;
       public          postgres    false    239    241    3299            �           2606    16717 =   sub_event_participant sub_event_participant_sub_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sub_event_participant
    ADD CONSTRAINT sub_event_participant_sub_event_id_fkey FOREIGN KEY (sub_event_id) REFERENCES public.sub_event(sub_event_id);
 g   ALTER TABLE ONLY public.sub_event_participant DROP CONSTRAINT sub_event_participant_sub_event_id_fkey;
       public          postgres    false    227    241    3283            �           2606    16617     sub_event sub_event_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sub_event
    ADD CONSTRAINT sub_event_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.event_type(event_type_id);
 J   ALTER TABLE ONLY public.sub_event DROP CONSTRAINT sub_event_type_id_fkey;
       public          postgres    false    3277    223    227            �           2606    16550     user_role user_role_role_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(role_id);
 J   ALTER TABLE ONLY public.user_role DROP CONSTRAINT user_role_role_id_fkey;
       public          postgres    false    219    3269    217            �           2606    16545     user_role user_role_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_account(user_id);
 J   ALTER TABLE ONLY public.user_role DROP CONSTRAINT user_role_user_id_fkey;
       public          postgres    false    219    3265    215            �           2606    16682 "   volunteer volunteer_course_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.volunteer
    ADD CONSTRAINT volunteer_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(course_id);
 L   ALTER TABLE ONLY public.volunteer DROP CONSTRAINT volunteer_course_id_fkey;
       public          postgres    false    237    3293    233            �           2606    16677 !   volunteer volunteer_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.volunteer
    ADD CONSTRAINT volunteer_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(event_id);
 K   ALTER TABLE ONLY public.volunteer DROP CONSTRAINT volunteer_event_id_fkey;
       public          postgres    false    237    3281    225            �   �   x�m�ˍC1�5T�xֽ|�M-��
�����(��_Ȕ��y�.�h�aa�K~!�f M)�N�5pRM�K�Us��Eה}�OḸ;�Qc����� ��F��LYB{1�F\��}�ؓ��-�O�x��9P3��>�n��}6�؉y����Q:�      �   :   x�3�4��uv�2�N@�D;s�pq:99r�i_ m�+8���r��� �=... �[      �   4   x�3���2��M�KLO�M�+�2�)J,K�QH�KQ�/-�,������ !j�      �   �  x��VMs�6=ÿb�K.�J��nN�:n�$c9Ӌ/	��H�H+j&��� M���G3&��۷o��r3�ٲ5�sp� uǺJ9��� � �t�Um��fa�σ�<̀G�8]�d�����aU�b�x�~��mmD����<�Gi�fQ6��ݜ�d�I�	J���qǾh�ì��
��������/��%���|�������vC�b�����p���rmno�O��1���������K�z5ş����0�`A�@<]D�s �����i���<H,�ߜ�~5���U-�J1�����h�O¢-úBI]H�_������I��~tSBAB�yv\U#�E�M�U����FU�B�y��+�[� ;�`e�>F����4؎�2yO��v�v��_�L�K�(��)!A�BƩ��ki=Ct�]@q����;�*	��� �uxJ��l�c�y�?��Qp������K���G��탠(��W�lZZ��I�9)"LY�4�H+��]�^^�]�Z�ys��B�VB[K�d	�A�(����D����Ճ�Nu{X��V5o\h݋��u���w�T=������ŧkO�)��VcQ�X)��3�p����⌧p����o]!�U#�֑���	��'��ڃ���(tNi�)���I{66B��ԉ����t���M_�.v�eiՉF������tY�A�N81����KY�������,���1�Nn0��a�3�S�D��`������*���~��E�d+l�P�q޲�~�+�
�J�W�Vz�����:�
��PGGE�Ó��4=� ���w���<��$���H�O�9�ѥ)�b̼/���k���<Ä(�����<U�m�e�JR�� ]z��ԋ��~�쓂֚����%�W
[��TVk�{l.:j�缫�^0�3��]��r9ތ�"%�4��'S�/�w}yX+�]Ju���ZL����A��{s6]O|��b�m���� �?��b~�ɑf<�&��$
�49�E�"uĞ}=�rX�����H�((*%�~�]V���CN�����������A��$x�*+�/T���G��	��������R�/�w��dD2��hƜl�(�޼
+��)��${U���i��=��>P~@�~��l͏��8VQ�����Q�����X��i"'8��XZ^������ ���1      �   X   x�]̱�0�������,��(U$������	�3n�o���[���:��'6*���/c�j�-4�#��#̪R���/�B      �   b   x�3���+I-�K�Qu�2B�ܹ����@B&��P!���<.S$�����.3��Hs��Yb�%'� C07���aha��qqq �3�      �   .   x�3��U��,K-*�,�T��������+I-�K������ ��      �   �   x�=�K� ���� �����c�ۥ��H�����3�>	����� ���# G�x��@xv�vv�7�y��Ƃ�����u�S�[�:9��p.�a�f�����ڍ��d�V�B!,�T� ��_���'�iv�
���蠀#���y�9U�4I:A� z-�[�-K�q��~��H2��c��/T)�
��	:o�,{�F�      �      x�3���q�s��2�t��2c���� Y��      �   2   x�3�,.-H-RHL����2��Ɯ�e�y%
���E)�y�%�E\1z\\\ m�      �   ;  x��T�n�0<S_�?�O��-N�Zh�^r�$�"��H�u��Kڈ��
� �ggg����D����Gg�x���d�E���������>�8�+���ιP��D����_����"iIxq���T�nͫ��x�Z�)��l7��@E�@!�V�:�.��]�@c�vr���,����&���a�<�� �_�7��BWw��awn���u08���(f��t9iN����+�+J����a`��"b�Ԅ�L��<�������r�`� 5fh������Lɹh�����ir]�И�|��gM���- �&K�"��g���
mC�ʤ�}O5�n��&=a�jטآ}gO�a���=�S�y�Ի��'���u��g�X&WD����*�u�	m������e��;�(=a!��q�dT�Qz�O1�<\�,�0$LrĪ�S�)J��z�xo&b��"X��\��4j���%�0"�����Ŋl�nү���k���F�8�[дK�cWU�8yZ�Yd����΍�-�!Xr�qI�;K���7RI"�#�鋯��"˲�1�      �       x�3�4�41�2�4�41�2RƖ\1z\\\ /cn      �   �  x�eTY��<}�y��*�6n���(X_�T� Y.\~����7zC���>���`��i��a��g��P�0�e	D�]VZ益�7f rD�1+��D0F)n,R� bKH��''�����]�fs3y�a�9	�d��hh�t���{��LQ��V�E�Ʒ������� c\�\��^g�{?��Mܾ	����9\�G�ԑav]W��J�[}�Nw�jN�U��ݞ%6-u����U��F{����P�^�u�Ac�T�/K���6թ{�~�O��<�^n��5�N6^����H����/�>��J����h�RP�>A���v%�}� ���T���hk3�#��dIt�ѱ��(�c$����hż�4k�\@c�T�
~��<�_��*u���N#���~�iI�3u�~Z{�b�H��꒐�W���@h���h�ŀ�� U�6JP����׵`����bwf߷`q^�G�F"�ԗ`"�Z�;L��j��3y�W��Uq�*��p���j,P
��p�骖g��iU$�Π�G��"us�W�ʕD�����v8R%4��i~�����	�L�W���{�W�ζ��ay�q��^5�JDw<r�ʇ���/��?���'�w1<����NHF�.�,�\�^3��k��ʙ����U�v��q��͇fDݲE�� ��$E���޻��)�R�Ι<�\�U���ώ�����s��M?��l@���Ů�:�*	'�������-��Ĳ"�L���h��B�9G��*��݄׉ٯhiPΖ�i��|:^�d��H����\XIìT4�!.˂�,I���z���>�b��A����+Ȣ�����䃗~��9��|��i���Tw�B���qv�m���?h��,52�u y�ٿ �Ձ��O?~/�Oq��&��������[[��/c�S��'��[�9/
â{D�������1"�h      �   E   x��� !��b.A]����@��c5"u"F���d&+�����dq �n���A�����e�      �   �   x�U���0E�ׯ�H�{��F�䠃1N.��,4iQߠ�1w;�9�Z`8���R�ޮk�hwB�R*H�w�ٌ���Z�S��!A@�U�cx,�����[�	�w�����M�Ƀ�J��3�[B��'�Pn�}�Ī���7�U�4���B�7�L2X     