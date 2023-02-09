<template>
    <div class="login_container">
        <div class="login_box">
            <div class="login_box_left">
                <p>Hi！你好<br>
                欢迎进入金桥借还款管理系统
                </p>
            </div>
            <div class="login_box_right">
                <h2>登录系统</h2>
            <el-form label-width="0px"  class="login_in" ref="loginForm" :model="loginForm" :rules="rules" >
                <p>系统账号</p>
                <el-form-item prop="uname" >
                    <el-input type="text" prefix-icon="el-icon-user" v-model="loginForm.uname" clearable></el-input>
                </el-form-item>
                <p>账号密码</p>
                <el-form-item prop="upassword">
                    <el-input type="password" prefix-icon="el-icon-key" v-model="loginForm.upassword" clearable></el-input>
                </el-form-item>
                <div class="pwd">
                    <el-checkbox id="cpwd" v-model="checked">记住密码</el-checkbox>
                    <el-link id="fpwd" type="info">忘记密码？</el-link>
                </div>
                <div class="btns">
                    <el-button id="btns01" type="primary" @click="submitForm('loginForm')">登录</el-button>
                </div>
            </el-form>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "login",
        data(){
            var checkUname = (rule, value, callback) => {
                const r = /^ [\u4e00-\u9fa5]|\w{6,20}$/; // 6-20位中文或任意字符
                if (value == null || String(value).trim() === "") {
                    callback(new Error('用户名不能为空'));
                } else if (!r.test(value)) {
                    callback(new Error("用户名格式不正确"));
                }else {
                    callback();
                }
            };
            var checkPwd= (rule, value, callback)=> {
                const r = /^\w{6,8}$/; // 6-8位任意字符
                if (value == null || String(value).trim() === "") {
                    callback(new Error('密码不能为空'));
                } else if (!r.test(value)) {
                    callback(new Error("密码格式不正确"));
                }else {
                    callback();
                }
            };
            return {
                loginForm: {
                    uname: '',
                    upassword: '',
                }, rules: {
                    uname: [
                  //      { required:true, validator: checkUname, trigger: 'blur' }
                    ],
                    upassword: [
                    //    { required:true, validator: checkPwd, trigger: 'blur' }
                    ]
                },checked:false,
            }
        },methods:{
            submitForm(loginForm) {
                // 校验参数
                this.$refs[loginForm].validate((valid) => {
                    if (valid) {
                        this.$http.post("/login",this.loginForm).then((res)=>{
                         //返回若是管理员返回管理员信息，若是员工返回员工信息
                            debugger
                            if(res.data.length>0){
                                sessionStorage.setItem("userData",JSON.stringify(res.data[0]))
                                this.$router.push({
                                    path:"/homeIndex",
                                })
                            } else {
                                this.$message({
                                    type: 'error',
                                    center:'true',
                                    duration:'2000',
                                    offset:'250',
                                    message: '账号或密码错误'
                                });
                            }
                        })
                    } else {
                        this.$message({
                            type: 'error',//未通过校验提交到后台的情况
                           // message: '参数不合法'
                        });
                        return false;
                    }
                });
            },
        }
    }
</script>
<style scoped >
    .login_container {
        background-image: url("../assets/img/loginbg.png");
        background-size:cover;
        height: 100%;
        width: 100%;
        min-width:1000px;
        min-height: 450px;
    }
    .login_box{
        position: absolute;
        width: 1000px;
        height: 450px;
        background-color: #fff;
        border-radius: 25px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .login_box_right {
        float: right;
        height: 100%;
        width:45%;
        border-top-right-radius:25px;
        border-bottom-right-radius:25px;
        background-color: #5DB0FA;
    }
    .login_box_left {
        float: left;
        background-image: url("../assets/img/loginleft.png");
        background-size: cover;
        height: 100%;
        width:55%;
        border-top-left-radius:25px;
        border-bottom-left-radius:25px;
        background-color: #017EF4;
    }
    .btns {
        display: flex;
        width: 100%;
        padding-top: 60px;
    }
    #btns01{
        width: 80%;
        margin: auto;
        background-color: #2F88F4;
    }
    .login_in {
        position: absolute;
        width: 45%;
        padding: 30px 30px;
        box-sizing: border-box;
    }
    p,h2,.pwd #cpwd,.pwd #fpwd{
        color: white;
        opacity: 70%;
     }
    .login_box_left p{
        width: 50%;
        height: 20%;
        text-align: left;
        margin: auto;
        padding: 50px;
        font-size: larger;
    }
    .login_in p{
        padding: 0;
        text-align: left;
    }
    .pwd{
        width: 100%;
        height: 40%;
        padding-top: 10px;
    }
    .pwd #cpwd{
        float: left;
    }
    .pwd #fpwd{
        float: right;
    }
</style>