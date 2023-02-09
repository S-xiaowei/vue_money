<template>
        <el-container id="box">
            <el-aside id="aside" width="180px">
                <div :key="fit" class="img" @click="toself">
                    <el-avatar class="pic"
                                :src="imageUrl"
                                :fit="fit"
                    >
                        <span v-if="userData.hasOwnProperty('aid')">
                           {{ userData.aname.substring(0,1) }}
                        </span>
                        <span v-if="userData.hasOwnProperty('eid')">
                            {{ userData.ename.substring(0,1) }}
                        </span>
                    </el-avatar>
                      <div style="color: white" v-if="userData.hasOwnProperty('aid')">管理员{{userData.aname}}</div>
                      <div  style="color: white" v-if="userData.hasOwnProperty('eid')&&userData.dname!='财务部'">
                          {{userData.dname}}{{userData.job}}{{userData.ename}}</div>
                    <div  style="color: white" v-if="userData.hasOwnProperty('eid')&&userData.dname=='财务部'">
                        财务{{userData.ename}}</div>
                     </div>
                    <el-menu
                            :router="true"
                            :default-active="this.$route.path"
                            class="menu"
                            @open="handleOpen"
                            @close="handleClose"
                    >
                        <el-menu-item index="/borrowList" class="item" >
                            <i class="el-icon-document-copy"></i>
                            <span slot="title">借款中心</span>
                        </el-menu-item>
                        <el-menu-item index="/reserveList" class="item">
                            <i class="el-icon-document-checked"></i>
                            <span slot="title">还款中心</span>
                        </el-menu-item>
                        <el-menu-item index="/checkList" class="item" v-if="userData.hasOwnProperty('eid')&&userData.dname=='财务部'||userData.job=='经理'">
                            <i class="el-icon-discount"></i>
                            <span slot="title">审核中心</span>
                        </el-menu-item>
                            <el-menu-item index="/manageList" class="item" v-if="userData.hasOwnProperty('aid')">
                                <i class="el-icon-setting"></i>
                                <span slot="title">数据中心</span>
                            </el-menu-item>
                        <el-menu-item index="/selfCenter" class="item">
                            <i class="el-icon-guide"></i>
                            <span slot="title">个人中心</span>
                        </el-menu-item>
                    </el-menu>
            </el-aside>
            <el-container id="container" style="min-width: 1100px">
                <el-header id="header" height="85px">
                    <h1 class="title">{{title}}</h1>
                    <div class="time">
                        当前时间： {{now_time}}
                        <br> <br> <br>
                        <i class="el-icon-switch-button mouse" @click="esc">退出</i>
                    </div>
                </el-header>
                <el-main id="main"><router-view :imageUrl="imageUrl" :userData="userData" @backTitle="backTitle"  @getTimeFromChild="getTimeFromChild" ></router-view></el-main>
            </el-container>
        </el-container>
</template>

<script>
    export default {
        name: "homeIndex",
        data() {
            return {
                photoUrl: 'http',
                fit: 'cover',
                imageUrl: '',
                title:'借款信息列表',
                userData:'',
                now_time:''
            }
        },
        methods: {
            toself(){
                this.$router.push({
                    path:'/selfCenter'
                })
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
           esc(){
                this.$router.push({
                    path:"/login",
                })
            },
            getTimeFromChild(now_time){
                this.now_time = now_time
            },
            backTitle(title){
                this.title=title
            },
            //显示当前时间（年月日时分秒）
            timeFormate(timeStamp) {
                let year = new Date(timeStamp).getFullYear();
                let month = new Date(timeStamp).getMonth() + 1 < 10 ? "0" + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1;
                let date = new Date(timeStamp).getDate() < 10 ? "0" + new Date(timeStamp).getDate() : new Date(timeStamp).getDate();
                let hh = new Date(timeStamp).getHours() < 10 ? "0" + new Date(timeStamp).getHours() : new Date(timeStamp).getHours();
                let mm = new Date(timeStamp).getMinutes() < 10 ? "0" + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes();
                let ss = new Date(timeStamp).getSeconds() < 10 ? "0" + new Date(timeStamp).getSeconds() : new Date(timeStamp).getSeconds();
                this.now_time = year + "年" + month + "月" + date + "日" + " " + hh + ":" + mm + ':' + ss;
            },
            nowTimes() {
                this.timeFormate(new Date());
                setInterval(this.nowTimes, 1000);
                //清除定时器，解决网页卡顿问题
                clearInterval(this.nowTimes);
                this.nowTimes = null;
            },
        },created() {
            this.userData=JSON.parse(sessionStorage.getItem("userData"))
            this.imageUrl=this.$http.defaults.baseURL+"/upload/"+this.userData.uid
            this.nowTimes() //获取时间的方法
        } ,   beforeDestroy() { //销毁定时器
            clearInterval(this.nowTimes)
            this.nowTimes = null;
        }
    }
</script>

<style scoped>
    *{
        margin: 0;
        padding: 0;
    }
    html,body{
        width: 100%;
        height: 100%;
    }
    .pic{
        font-size: 60px;
        width: 90px;
        height: 90px;
        margin-bottom: 10px;
        border-radius: 50%;
        background-color: white;
        color: #017EF4;
        line-height: 90px;
    }
    .item{
        background-color:rgba(36,109,255,0.85);
        color: rgba(255,255,255,0.9);
        margin-bottom: 30px;
        margin-left: 8px;
        border-top-left-radius: 30%;
    }
    .item:hover{
        background-color:white;
        color:rgba(36,109,255,0.85)
    }
    .menu{
        background-color:#0263F1;
        margin: auto;
    }
    .img:hover{
        cursor: pointer;
    }
    .img{
        margin-bottom: 45px;
        height: 100px;
    }
    .time{
        float: right;
        height: 150px;
    }
    .title{
        float: left;
        color: white;
        opacity: 80%;
        font-size: larger;
        line-height: 105px;
        margin-left: 110px;
    }
    #box{
        background-color: #0263F1;
        height: 100%;
    }
    #aside{
        opacity: 85%;
        height: 100%;
    }
    #container{
        color: white;
        height: 100%;
        /*width:90%;*/
    }
    #header{
        background-image: url("../assets/img/logo.png");
        background-size: 1100px 85px;
    }
    #main{
        background-image: url("../assets/img/loginbg.png");
    }
</style>
<style>
    /*标题背景色*/
    .dialog .el-dialog__header  {
        background-color: #017EF4;
    }
    /*body背景色*/
    .dialog .el-dialog__body  {
        background-color: white;
    }
    .dialog .el-dialog__footer{
        background-color: white;
    }
    .mouse:hover{
        cursor:pointer
    }
    .mouse{
        color: white;
        width: 60px;
        height: 60px;
        margin-left: 220px;
    }
</style>