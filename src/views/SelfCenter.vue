<template>
    <div>

        <el-button type="warning" :size=size @click="changeMsg('pwd')" style="margin-top:50px;margin-left: 580px">修改个人密码</el-button>

      <!--  emp个人信息-->
        <el-descriptions
                class="margin-top"  :column="2" :size="size"
                style="width: 80%;margin: 10px auto" border
                v-show="userData.hasOwnProperty('eid')">

            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-upload"></i>
                    用户头像
                </template>
                <el-upload
                        class="avatar-uploader"
                        action="#"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :http-request="uploadImg"
                >
                    <el-avatar class="pic1"
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
                </el-upload>
            </el-descriptions-item>

            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-user"></i>
                       用户名
                </template>
               {{userData.uname}} <span class="edit" @click="changeMsg('uname')"><i class="el-icon-edit"></i>修改</span>
            </el-descriptions-item>

            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-operation"></i>
                    用户类型
                </template>

                <span v-if="userData.hasOwnProperty('aid')"> 管理员</span>
                <span v-if="userData.hasOwnProperty('eid')&&userData.dname=='财务部'"> 财务</span>
                <span v-if="userData.hasOwnProperty('eid')&&userData.job=='经理'"> 经理</span>
                <span v-if="userData.hasOwnProperty('eid')&&userData.job=='职员'&&userData.dname!='财务部'"> 职员</span>

            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-grid"></i>
                    员工编号
                </template>
               {{userData.eid}}
            </el-descriptions-item>
            <el-descriptions-item >
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    员工姓名
                </template>
                {{userData.ename}}
            </el-descriptions-item>
            <el-descriptions-item >
                <template slot="label">
                    <i class="el-icon-coordinate"></i>
                    性别
                </template>
                {{userData.sex}}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-home"></i>
                    部门
                </template>
                <el-tag size="small"> {{userData.dname}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-data-line"></i>
                    职位
                </template>
                <el-tag size="small"> {{userData.job}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-time"></i>
                    入职日期
                </template>
                {{userData.hiredate}}
            </el-descriptions-item>
        </el-descriptions>

    <!--    Admin个人信息-->
        <el-descriptions
                class="margin-top"  :column="1" :size="size"
                style="width: 60%;margin: 20px auto" border
                v-show="userData.hasOwnProperty('aid')">
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-upload"></i>
                    用户头像
                </template>
                <el-upload
                        class="avatar-uploader"
                        action="#"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :http-request="uploadImg"
                >
                    <el-avatar class="pic1"
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
                </el-upload>
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-user"></i>
                    用户名
                </template>
                {{userData.uname}}  <span class="edit" @click="changeMsg('uname')"><i class="el-icon-edit"></i>修改</span>
            </el-descriptions-item>

            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-operation"></i>
                    用户类型
                </template>
             管理员
            </el-descriptions-item>

            <el-descriptions-item >
                <template slot="label">
                    <i class="el-icon-s-grid"></i>
                    管理员编号
                </template>
                {{userData.aid}}
            </el-descriptions-item>
            <el-descriptions-item >
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    管理员姓名
                </template>
                {{userData.aname}}
            </el-descriptions-item>
        </el-descriptions>

        <!--弹出层-->
        <el-dialog :title="title" :visible.sync="dialogFormVisible" :rules="rules" class="dialog" style="width: 90% ;margin: auto">
            <el-form :model="selfForm" ref="selfForm" :rules="rules" style="width: 60%;height:220px ;margin: auto">
                <div v-if="title=='修改用户名'">
                    <el-form-item label="原用户名：" :label-width="formLabelWidth"  >
                        <el-input v-model="selfForm.uname" autocomplete="off" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="新用户名：" :label-width="formLabelWidth" prop="newName">
                        <el-input v-model="selfForm.newName" placeholder="请输入新用户名" @change="flagUser"  autocomplete="off" required clearable ></el-input>
                        <span style="color: #42b983;float: right " v-show="success_show"> <i class="el-icon-success"></i>用户名可用</span>
                        <span style="color: red;float: right" v-show="error_show"> <i class="el-icon-circle-close"></i>用户名不可用</span>
                    </el-form-item>
                </div>
                <div v-if="title=='修改密码'">
                    <el-form-item label="旧密码：" :label-width="formLabelWidth" prop="oldPassword" >
                        <el-input type="password" show-password clearable v-model="selfForm.oldPassword" placeholder="请输入旧密码" autocomplete="off" ></el-input>
                    </el-form-item>
                    <el-form-item label="新密码：" :label-width="formLabelWidth"  style="margin-bottom: 30px"  prop="newPassword">
                        <el-input type="password" show-password clearable v-model="selfForm.newPassword" placeholder="请输入新密码" autocomplete="off" ></el-input>
                    </el-form-item>
                    <el-form-item label="再次确认密码：" :label-width="formLabelWidth"  prop="rePassword">
                        <el-input type="password" show-password clearable v-model="selfForm.rePassword" placeholder="请输入再次确认密码" autocomplete="off"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="updMsg">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ElTableRow from "element-ui/packages/table/src/table-row";
    export default {
        name: "selfCenter",
        components: {ElTableRow},
        props:{
            imageUrl:{
                type:String,
                required:true
            }
        },
        data(){
            var checkUname = (rule, value, callback) => {
                const r = /^(?=.*?[a-zA-Z])(?=.*?[0-9])[0-9a-zA-Z]{4,20}$/// 用户名必须由英文和数字组成，且长度为6-20
                if (value == null || String(value).trim() == ""||value=='') {
                    callback(new Error('用户名不能为空！'));
                } else if (!r.test(value)) {
                    callback(new Error("用户名必须由英文和数字组成，且长度为4-20！"));
                } else {
                    callback();
                }
            };
            var checkNewPwd = (rule, value, callback) => {
                const r = /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[_\-@&=])[0-9a-zA-Z_\-@&=]{6,}$/; // 密码只能由数字、26个英文字母和特殊字符组成，且长度不小于六位
                if (value == null || String(value).trim() === ""||value=='') {
                    callback(new Error('新密码不能为空！'));
                } else if (!r.test(value)) {
                    callback(new Error("密码必须由数字、26个英文字母和特殊字符组成，且不小于六位！"));
                } else {
                    callback();
                }
            };
            var checkRePwd = (rule, value, callback) => {
                if (value == null || String(value).trim() === ""||value=='') {
                    callback(new Error('再次确认密码不能为空！'));
                } else if (value!=this.selfForm.newPassword) {
                    callback(new Error("两次输入密码不一致！"));
                } else {
                    callback();
                }
            };
            return{
                fit: 'cover',
                title:'',
                size:"medium",
                userData:JSON.parse(sessionStorage.getItem("userData")),
                dialogFormVisible:false,
                selfForm:{
                    uid:'',
                    uname:'',
                    newName:'',
                    oldPassword:'',
                    newPassword:'',
                    rePassword:'',
                },
                formLabelWidth:'120px',
                rules:{
                    newName: [
                        {required: true, validator: checkUname, trigger: "blur"}
                    ],
                    newPassword: [
                        {required: true,validator: checkNewPwd, trigger: "blur"}
                    ],
                    oldPassword: [
                        {required: true, message: "旧密码不能为空", trigger: "blur"}
                    ],
                    rePassword: [
                        {required: true,validator: checkRePwd , trigger: "blur"}
                    ],
                },
                error_show:true,
                success_show:true
            }
        },
        methods: {
            //上传成功显示
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            //上传之前的校验
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                //图片不能超过20mb
                const isLt2M = file.size / 1024 / 1024 < 20;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            //自定义上传行为，发送请求方法 item上传的文件
            uploadImg(item){
                //将图片封装为file形式
                let param = new FormData();
                param.append('image',item.file)
                param.append('fileName',this.userData.uid)
                this.$http.post("/uploadImg",param).then(res=>{
                        location.reload()//调用页面刷新函数,刷新页面
                }).catch(()=>{
                    this.$message.error("图片上传失败！")
                })
            },
            changeMsg(val) {
                if (val == 'uname') {
                    this.title = "修改用户名"
                } else if (val == 'pwd') {
                    this.title = "修改密码"
                }
                this.error_show = false//判断用户名的显示状态清空
                this.success_show = false
                this.dialogFormVisible = true
                //重置表单
                if (this.$refs["selfForm"] != null) {
                    this.$refs["selfForm"].resetFields()
                }
                //给表单项赋值
                this.selfForm = {
                    uname: this.userData.uname,
                    uid: this.userData.uid
                }

            },
            updMsg() {
                //如果是用户名重复也不能让其提交
                //保存前要先做表单校验
                debugger
                if (typeof (this.selfForm.oldPassword)!="undefined"){
                    this.success_show=true
                }
                debugger
                if (this.success_show) {
                    this.$refs["selfForm"].validate(valid => {
                        if (valid) {
                            this.$http.post("/updUser", this.selfForm).then(res => {
                                debugger
                                if (res.data == "success") {
                                    //重新赋值
                                    debugger
                                if ((typeof this.selfForm.oldPassword)=="undefined"){
                                    this.userData.uname = this.selfForm.newName
                                    sessionStorage.removeItem('userData')
                                    sessionStorage.setItem('userData',JSON.stringify(this.userData))
                                    location.reload()//调用页面刷新函数,刷新页面
                                }
                                    this.$message.success(this.title + "成功")
                                    //关闭弹出层
                                    this.dialogFormVisible = false
                                } else if (res.data=="errorPwd") {
                                    //重置表单
                                    this.$refs["selfForm"].resetFields()
                                    this.$message.error("旧密码输入错误！请重新输入")
                                }else {
                                    this.$message.error(this.title + "失败")
                                    //关闭弹出层
                                    this.dialogFormVisible = false
                                }
                            }).catch(() => {
                                this.$message.error(this.title + "失败,请联系管理员")
                            })
                        }
                    })
                }
            },
            flagUser() {
                this.$refs["selfForm"].validate(valid => {
                    if (valid) {
                        this.$http.post("/flagUname",this.selfForm.newName,{
                            headers: {
                                'Content-Type': 'application/json'
                            }
                            }).then(res => {
                            if (res.data == "success") {
                                this.success_show = true;
                                this.error_show = false;
                            } else {
                                this.error_show = true;
                                this.success_show = false;
                            }
                        }).catch(() => {
                            this.$message.error("校验名字失败,请联系管理员")
                        })
                    }
                })
            },
        },
        created() {
            this.$emit("backTitle",'个人信息列表')
        }
    }
</script>

<style scoped>
    .pic1{
        font-size: 60px;
        width: 90px;
        height: 90px;
        border-radius: 0;
        color: #017EF4;
        line-height: 90px;
    }
    .edit{
        color: #017EF4;
        margin-left: 30px;
    }
    .edit:hover{
        cursor: pointer;
        color: orange;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>