<?php

namespace app\api\controller;

use think\Controller;
use think\Db;
use think\Cache;
use think\Request;

class Goldrandom extends Controller
{

    protected $data;

    public function __construct(Request $request = null)
    {
        parent::__construct($request);
        $this->data = input('post.');
        header("Access-Control-Allow-Origin: *");
    }


    /**
     * 抽个奖
     */
    public function index()
    {
        $prize_arr = array(
            '0' => array('id'=>1,'min'=>[0,331],'max'=>[29,360],'prize'=>'88金币','v'=>89),
            '1' => array('id'=>2,'min'=>31,'max'=>89,'prize'=>'6666御币','v'=>0),
            '2' => array('id'=>3,'min'=>91,'max'=>149,'prize'=>'5张推荐票','v'=>5),
            '3' => array('id'=>4,'min'=>151,'max'=>209,'prize'=>'8888金币','v'=>5),
            '4' => array('id'=>5,'min'=>211,'max'=>269,'prize'=>'66御币','v'=>1),
            '5' => array('id'=>6,'min'=>271,'max'=>329,'prize'=>'华为P30PRO','v'=>0),
        );

        foreach ($prize_arr as $key => $val) {
            $arr[$val['id']] = $val['v'];
        }

        $rid = $this->getRand($arr); //根据概率获取奖项id

        $res = $prize_arr[$rid-1]; //中奖项
        $min = $res['min'];
        $max = $res['max'];
        if($res['id']==1){ //指针正北
            $i = mt_rand(0,1);
            $result['angle'] = mt_rand($min[$i],$max[$i]);
        }else{
            $result['angle'] = mt_rand($min,$max); //随机生成一个角度
        }
        $result['prize'] = $res['prize'];
        $result['id'] = $res['id'];

        //查询用户总抽奖次数,前端需求
        $item = Db::name('gold_random')->where('uid',$this->data['uid'])->sum('status+video_number+gold_number');

        //写入用户记录
        $status =  $this->gold_record( $result );
        if( $status == 0 ){
            return json_encode(['code'=>0,'msg'=>'success','item'=>$item,'data'=>[$result] ]);
        }else{
            return json_encode(['code' => 1,'item'=>$item ,'msg' => "抽奖次数不足"]);
        }
    }

    /**
     * 计算概率
     */
    protected function getRand($proArr)
    {
        $result = '';

        //概率数组的总概率精度
        $proSum = array_sum($proArr);

        //概率数组循环
        foreach ($proArr as $key => $proCur) {
            $randNum = mt_rand(1, $proSum);
            if ($randNum <= $proCur) {
                $result = $key;
                break;
            } else {
                $proSum -= $proCur;
            }
        }
        unset ($proArr);

        return $result;

    }

    /**
     * 记录用户数据
     */

    protected function gold_record( $result ){
        //查询用户是否可以抽奖
        $status = Db::name('gold_random')->where('uid',$this->data['uid'])->value('status');
        if( $status === 0 ){
            return 1;
        }

        //写入用户抽奖记录
        $nickname = Db::name('member_list')->where('member_list_id',$this->data['uid'])->value('member_list_nickname');
        $array = [
            'uid'       => $this->data['uid'],
            'name'      => $nickname,
            'prize'     => $result['prize'],
            'time'      => date('Y-m-d H:i:s',time()),
        ];
        Db::name('gold_prize')->insert($array);

        //判断用户是否存在
        $info = Db::name('gold_random')->where('uid',$this->data['uid'])->find();
        if($info){
            Db::name('gold_random')->where('uid',$this->data['uid'])->setDec('status');
        }else{
            $where = [
                'uid'      =>$this->data['uid'],
                'status'   =>0
            ];
            Db::name('gold_random')->insert($where);
        }

        //把对应奖品同步到用户账户
        switch ( $result['id'] ) {
            case 1: Db::name('member_list')->where('member_list_id', $this->data['uid'])->setInc('gold', 88);
                break;
            case 2: Db::name('member_list')->where('member_list_id', $this->data['uid'])->setInc('coin', 6666);
                break;
            case 3: Db::name('member_list')->where('member_list_id', $this->data['uid'])->setInc('day_ticket', 5);
                break;
            case 4: Db::name('member_list')->where('member_list_id', $this->data['uid'])->setInc('gold', 8888);
                break;
            case 5: Db::name('member_list')->where('member_list_id', $this->data['uid'])->setInc('coin', 66);
                break;
            case 6:
                break;
        }
        return 0;
    }

    /**
     * 用户看小视频抽奖
     */

    public function video_random()
    {
       $re = Db::name('gold_random')->where('uid', $this->data['uid'])->value('video_number');
        if($re !=0) {
            //判断用户是否看完小视频
            if ($this->data['status'] != 1) {
                return json(['code' => 1, 'msg' => "请看完小视频再来抽奖"]);
            } else {
                $re = Db::name('gold_random')->where('uid', $this->data['uid'])->find();
                //判断用户是否有记录
                if ($re) {
                    Db::name('gold_random')->where('uid', $this->data['uid'])->setInc('status');
                } else {
                    $where = [
                        'uid' => $this->data['uid'],
                        'status' => 1
                    ];
                    Db::name('gold_random')->insert($where);
                }
                Db::name('gold_random')->where('uid', $this->data['uid'])->setDec('video_number');
                return json(['code' => 0, 'msg' => "抽奖次数+1"]);
            }
        }else{
            return json(['code' => 1, 'msg' => "今日看观看小视频次数已用完"]);
        }
    }

    /**
     * 用户花费金币抽奖
     */
    public function gold_prize()
    {
        $re = Db::name('gold_random')->where('uid', $this->data['uid'])->value('gold_number');
        if($re !=0) {
            //判断用户金币是够足够
            $gold = Db::name('member_list')->where('member_list_id', $this->data['uid'])->value('gold');
            if( $gold >= 100) {
                $re = Db::name('gold_random')->where('uid', $this->data['uid'])->find();
                //判断用户是否有记录
                if ($re) {
                    Db::name('gold_random')->where('uid', $this->data['uid'])->setInc('status');
                } else {
                    $where = [
                        'uid' => $this->data['uid'],
                        'status' => 1
                    ];
                    Db::name('gold_random')->insert($where);
                }
                Db::name('gold_random')->where('uid', $this->data['uid'])->setDec('gold_number');
                return $this->index();
            }else{
                return json_encode(['code' => 1, 'msg' => "金币不足"]);
            }
        }else{
            return json_encode(['code' => 1, 'msg' => "今日金币抽奖次数已用完"]);
        }

    }

    /**
     * html页面渲染及我的抽奖记录
     */
    public function lottery_list()
    {
        $lst = Db::name('gold_prize')->field('prize,time,status')->where('uid',input('uid'))->select();
        foreach ($lst as $k=>$v) {
            if ( $lst[$k]['status'] ==0) {
                $lst[$k]['status'] = '奖品发放成功';
            } else {
                $lst[$k]['status'] = '奖品发放失败';
            }
        }

        $this->assign('lst', $lst);
        return $this->fetch('lottery_list');
    }
    

    /**
     * html页面渲染及中奖滚动数据
     */
    public function lottery()
    {
        $lst = Db::name('gold_prize')->field('name,prize')->limit(15)->order('time desc')->select();

        $this->assign('lst', $lst);
        return $this->fetch();
    }

    /**
     * html页面测试
     */
    public function jscontext()
    {
        //$lst = Db::name('gold_prize')->field('name,prize')->limit(15)->order('time desc')->select();

        //$this->assign('lst', $lst);
        return $this->fetch();
    }


}