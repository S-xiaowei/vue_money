<template>
    <div>
        <el-tabs v-model="activeName"  type="card" @tab-click="handleClick" style="background-color: rgba(255,255,255,0.95);color: black;height:500px;">
            <el-tab-pane v-for="tabName in tab_name" :label="tabName" :name="tabName"></el-tab-pane>
            <!--查询条件-->
            <el-form :inline="true" :model="query" style="float: left" ref="selectForm" >
                <span style="float: left">
                <el-form-item class="itemStyle" >
                    <span slot="label">{{show_name}}编号：</span>
                    <el-input v-model="query.id" :placeholder="'请输入'+show_name+'编号'" ></el-input>
                </el-form-item>
                <el-form-item class="itemStyle" >
                    <span slot="label">{{show_name}}名称：</span>
                    <el-input v-model="query.name" :placeholder="'请输入'+show_name+'名称'" ></el-input>
                </el-form-item>
                <span v-if="show_name=='员工'">
                 <el-form-item>
                    <span slot="label" class="lableStyle">部门名称：</span>
                <el-select  v-model="query.did" clearable placeholder="选择查询的部门名称">
                    <!--循环遍历deptList，生成下拉列表的列表项-->
                    <el-option v-for="dept in deptList" :label="dept.dname" :value="dept.did"></el-option>
                </el-select>
                </el-form-item>
                    <br>
                </span>
                </span>
                <span style="float: right">
                      <el-form-item>
                        <el-button type="success" @click="add" v-if="show_name!='用户'">新增{{show_name}}</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询{{show_name}}</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button  type="danger" @click="del" v-if="show_name!='用户'">删除{{show_name}}</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button  type="warning" @click="updPwd" v-if="show_name=='用户'">重置{{show_name}}密码</el-button>
                    </el-form-item>
                </span>
            </el-form>
            <!--查询的List-->
            <el-table
                    :data="tableData"
                    stripe
                    border
                    highlight-current-row
                    style="margin: 0 auto;"
                    @select="selectRow"
                    @selectAll="selectAll"
                    ref="listTable"
                    :header-row-style="{height:'50px'}"
                    :header-cell-style="{background:'#f5f7fa',padding:'5px'}"
                    :row-style="{height:'50px'}"
                    :cell-style="{padding:'2px'}"
            >
                <el-table-column
                        type="selection"
                        width="50px"
                >
                </el-table-column>
                <el-table-column
                        :label='show_name+"编号"'
                        prop="id"
                        width="120px"
                >
                </el-table-column>

                <el-table-column
                        :label='show_name+"名称"'
                        prop="name"
                        width="120px">
                </el-table-column>

            <div  v-if="show_name=='员工'">
                <el-table-column
                        label="部门名称"
                        prop="dname"
                        width="100px"
                >
                </el-table-column>
                <el-table-column
                        label="性别"
                        prop="sex"
                        width="80px"
                >
                </el-table-column>
                <el-table-column
                        label="职位"
                        prop="job"
                        width="80px"
                >
                </el-table-column>
                <el-table-column
                        label="入职日期"
                        prop="hiredate"
                        width="180px"
                >
                </el-table-column>
            </div>

                <el-table-column label="操作"  >
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                style="background-color: orange;color: white"
                                @click="handleUpd(scope.$index, scope.row)">修改
                        </el-button>
                        <el-button
                                size="mini"
                                style="background-color: #00F5B1;color: white"
                                @click="handleSelect(scope.$index, scope.row)">查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->

            <!--新增修改弹出层-->
            <el-dialog :title="dialogTitle"  :visible.sync="dialogFormVisible" class="dialog" >
                <el-form :model="manageForm" ref="manageForm" :rules="rules" >
                    <el-form-item class="itemStyle" v-if="manageForm.id != ''" :label='show_name+"编号:"' :label-width="formLabelWidth" :prop=manageForm.id >
                        <el-input  v-model="manageForm.id" autocomplete="off" readonly prop="id"></el-input>
                    </el-form-item>
                    <el-form-item class="itemStyle" :label="show_name+'名:'" :label-width="formLabelWidth" prop="name">
                        <el-input  v-model="manageForm.name" autocomplete="off"></el-input>
                    </el-form-item>

                    <div v-if="show_name=='员工'">
                    <el-form-item class="itemStyle" :label="show_name+'性别:'" :label-width="formLabelWidth" prop="sex">
                        <el-radio  v-model="manageForm.sex" label="男">男</el-radio>
                        <el-radio  v-model="manageForm.sex" label="女">女</el-radio>
                    </el-form-item>
                    <el-form-item class="itemStyle" :label="show_name+'职位:'" :label-width="formLabelWidth" prop="job">
                        <el-select  style="width: 100%" v-model="manageForm.job" clearable placeholder="选择职位">
                            <el-option  label="职员" value="职员" ></el-option>
                            <el-option  label="经理" value="经理"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="itemStyle" :label="show_name+'部门:'" :label-width="formLabelWidth" prop="did">
                        <el-select  style="width: 100%" v-model="manageForm.did" clearable placeholder="选择部门名称">
                            <!--循环遍历deptList，生成下拉列表的列表项-->
                            <el-option v-for="dept in deptList" :label="dept.dname" :value="dept.did"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="itemStyle" :label="show_name+'入职日期:'" :label-width="formLabelWidth" prop="hiredate">
                        <el-date-picker
                                v-model="manageForm.hiredate"
                                type="date"
                                placeholder="选择日期"
                                @change="getTime(manageForm.hiredate)"
                        >
                        </el-date-picker>
                    </el-form-item>
                    </div>
                </el-form>
                <div slot="footer">
                    <el-button @click="dialogFormVisible = false" >取 消</el-button>
                    <el-button type="primary" @click="saveDate(url,show_name)">确 定</el-button>
                </div>
            </el-dialog>
            <!--查看弹出层-->
            <el-dialog :title="'查看'+show_name"  :visible.sync="dialogSelectFormVisible" class="dialog">
                <el-descriptions  :column="2" border >
                    <el-descriptions-item :label='show_name+"编号:"'>{{selectData.id}}</el-descriptions-item>
                    <el-descriptions-item :label='show_name+"名称:"'>{{selectData.name}}</el-descriptions-item>
                    <div v-if="show_name=='员工'">
                    <el-descriptions-item :label='show_name+"性别:"'>{{selectData.sex}}</el-descriptions-item>
                    <el-descriptions-item :label='show_name+"部门:"'>
                        <el-tag size="small">{{selectData.dname}}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item :label='show_name+"职位:"'>
                        {{selectData.job}}
                    </el-descriptions-item>
                    <el-descriptions-item :label='show_name+"入职日期:"'>{{selectData.hiredate}}</el-descriptions-item>
                    </div>
                </el-descriptions>
            </el-dialog>
        </el-tabs>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="query.page"
                :page-sizes="[5,10,15,20]"
                :page-size="query.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
        >
        </el-pagination>
    </div>
</template>
<script>
    export default {
        name: "ManageList",
        data() {
            var check = (rule, value, callback) => {
                // 名字只能是英文或者中文
                const r = /^([\u4e00-\u9fa5]{2,6}|[a-zA-Z.\s]{2,20})$/
                if (value == null || String(value).trim() === "") {
                    callback(new Error('名称不能为空！'));
                } else if (!r.test(value)) {
                    callback(new Error("名称只能是英文或者中文！"));
                } else {
                    callback();
                }
            };
            return {
                tabPosition:'',//tab的显示位置
                activeName: '用户管理',
                tableData:[{}],
                tab_name:[
                    '用户管理',
                    '员工管理',
                    '部门管理',
                    '借款状态管理',
                    '借款类型管理',
                    '还款状态管理'
                ],
                manageForm:{
                    id:'',//id字段
                    name:'',//名称字段
                    hiredate:'',
                    sex:'',
                    did:'',
                    job:'',
                    uid:'',
                },
                query:{
                    id:'',
                    name:'',
                    did:'',
                    page:1,
                    limit:5
                },
                total:0,
                dialogFormVisible:false,
                deptList:[{}],
                url:'',//提交请求的url地址
                show_name:'',//tab页面切换的索引时候的name
                upd_name:'',//用于修改获取到的数组集合中的对象名，例如用户uid改为id
                formLabelWidth:'110px',
                //被选中的选项的集合
                selectionItems: [],
                dialogSelectFormVisible: false,
                selectData:'',
                dialogTitle:'',
                rules: {
                    name: [
                        {required: true, validator: check , trigger: "blur"}
                    ],
                    sex: [
                        {required: true, message: "性别不能为空", trigger: "change"}
                    ],
                    job: [
                        {required: true, message: "工作不能为空", trigger: "change"}
                    ],
                    hiredate: [
                        {required: true, message: "入职日期不能为空", trigger: "change"}
                    ],
                    did: [
                        {required: true, message: "部门不能为空", trigger: "change"}
                    ],
                },
            };
        },
        methods: {
            getTime(val) {
                const d = new Date(val);
                this.manageForm.hiredate= d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            },
            getList(){
                this.$http.post(this.url, this.query).then(res => {
                    this.total = res.data.count
                    let old_id=`${this.upd_name}id`
                    let old_name=`${this.upd_name}name`
                    this.tableData= JSON.parse(JSON.stringify(res.data.data).replace(new RegExp(`${old_id}`,'g'), 'id').replace(new RegExp(`${old_name}`,'g'), 'name'))
                }).catch(() => {
                    this.$message.error(this.show_name+"信息加载失败请联系管理员")
                });
            },
            // tabs标签页切换事件
            handleClick(tab, event) {
                //console.log(tab, event);
                //每次切换清空query数据
                this.query={
                        id:'',
                        name:'',
                        did:'',
                        page:1,
                        limit:5
                }
                if (tab.index == 0) {
                    //点击管理用户标签
                    this.show_name='用户'
                    this.url='/userListPage'
                    this.upd_name='u'
                } else if (tab.index == 1) {
                    //点击管理员工
                    this.show_name='员工'
                    this.url='/empListPage'
                    this.upd_name='e'
                } else if(tab.index==2){
                    //点击管理部门
                    this.show_name='部门'
                    this.url='/deptListPage'
                    this.upd_name='d'
                }else if(tab.index==3){
                    //点击管理借款状态
                    this.show_name='借款状态'
                    this.url='/bStateListPage'
                    this.upd_name='bs'
                }else if(tab.index==4){
                    //点击管理借款类型
                    this.show_name='借款类型'
                    this.url='/bTypeListPage'
                    this.upd_name='t'
                }else {
                    //点击管理还款状态
                    this.show_name='还款状态'
                    this.url='/rStateListPage'
                    this.upd_name='rs'
                }
                this.getList()
            },
            getAllDepts() {
                this.$http.post("/getDeptList").then(res => {
                    this.deptList = res.data
                }).catch(() => {
                    this.$message.error("部门信息加载失败，请联系管理员")
                })
            },
            add(){
                this.getAllDepts()
                //打开弹出层
                this.dialogFormVisible = true
                //修改标题
                this.dialogTitle=`新增${this.show_name}`
                //清空表单
                if(this.$refs["manageForm"] !=null){
                    this.$refs["manageForm"].resetFields()
                }
                this.manageForm={
                    id:'',//id字段
                        name:'',//名称字段
                        hiredate:'',
                        sex:'',
                        did:'',
                        job:'',
                        uid:'',
                }
            },
            search(){
                //点击查询按钮
                this.query.page = 1
                this.getList()

            },
            del(){
                //要求用户确认
                //判断被选中的条数
                let selection = this.selectionItems
                if (selection.length == 0) {
                    this.$message.warning("请选择一条数据")
                    return
                }
                this.$confirm('确定要删除所选'+this.show_name+'吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    //获取被选中项的主键
                    let arr = [];
                    for (let i = 0; i < selection.length; i++) {
                        arr.push(selection[i].id)
                    }
                    let url ='/delEmps'
                   if(this.show_name=='员工'){
                        url='/delEmps'
                    } else if(this.show_name=='部门'){
                        url='/delDepts'
                    } else if(this.show_name=='借款状态'){
                        url='/delBstates'
                    }else if(this.show_name=='借款类型'){
                        url='/delBtypes'
                    }else if(this.show_name=='还款状态'){
                        url='/delRstates'
                    }
                    this.$http.post(url, arr).then(res => {
                        if (res.data == "success") {
                            this.$message.success("删除成功")
                            //刷新表格
                            this.search()
                        } else {
                            this.$message.error("删除失败")
                        }
                        this.selectionItems = []
                    }).catch(() => {
                        this.$message.error("删除失败，请联系管理员")
                    });
                })
            },
            handleUpd(index,row){
                //修改标题
                this.dialogTitle="修改"+this.show_name+"信息"
                //重置表单
                if (this.$refs["manageForm"] !=null){
                    this.$refs["manageForm"].resetFields()
                }
                this.manageForm={
                    id:'',//id字段
                    name:'',//名称字段
                    hiredate:'',
                    sex:'',
                    did:'',
                    job:'',
                    uid:'',
                }
                //给表单项赋值
                this.manageForm = row
                console.log(row)
                this.manageForm.id=row.id.toString()
                //打开弹出层
                this.dialogFormVisible = true
            },
            handleSelect(index, row) {
                //打开弹出层
                this.dialogSelectFormVisible = true
                //修改标题
                this.dialogTitle = "查看借款信息"
                //给表单项赋值
                this.selectData = row
            },
            saveDate(){
                let url ='/addUser'
                if (this.show_name=='用户'){
                    url='/addUser'
                } else if(this.show_name=='员工'){
                    url='/addEmp'
                } else if(this.show_name=='部门'){
                    url='/addDept'
                } else if(this.show_name=='借款状态'){
                    url='/addBstate'
                }else if(this.show_name=='借款类型'){
                    url='/addBtype'
                }else if(this.show_name=='还款状态'){
                    url='/addRstate'
                }
                //保存前要先做表单校验
                this.$refs["manageForm"].validate(valid => {
                    let msg = "新增" + this.show_name
                    if (valid) {
                        //判断是新增还是修改
                        if (this.manageForm.id != "") {
                            msg = "修改" + this.show_name
                            if (this.show_name=='用户'){
                                url='/updUser'
                            }  else if(this.show_name=='部门'){
                                url='/addDept'
                            } else if(this.show_name=='员工'){
                                url='/updEmp'
                            }else if(this.show_name=='借款状态'){
                                url='/updBstate'
                            }else if(this.show_name=='借款类型'){
                                url='/updBtype'
                            }else if(this.show_name=='还款状态'){
                                url='/updRstate'
                            }
                        }
                            this.$http.post(url, this.manageForm).then(res => {
                                if (res.data == "success") {
                                    this.$message.success(msg + "成功")
                                } else {
                                    this.$message.error(msg + "失败")
                                }
                                //关闭弹出层
                                this.dialogFormVisible = false
                                //重新加载表格
                                this.search()
                            }).catch(() => {
                                this.$message.error(msg + "失败,请联系管理员")
                            })
                        }
                })

            },
            select(){
            },
            selectRow(selection, row) {
                console.log("selection:" + selection + "row" + row)
                this.selectionItems = selection
            },
            selectAll(selection) {
                this.selectionItems = selection
            },
            //每页多少条
            handleSizeChange(val) {
                this.query.limit = val
                this.search()
            },
            //当前在第几页
            handleCurrentChange(val) {
                this.query.page = val
                this.getList()
            },
            updPwd(){
                //要求用户确认
                //判断被选中的条数
                let selection = this.selectionItems
                if (selection.length == 0) {
                    this.$message.warning("请选择一条数据")
                    return
                }
                this.$confirm('确定要重置所选用户密码吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    //获取被选中项的主键
                    let arr = [];
                    for (let i = 0; i < selection.length; i++) {
                        arr.push(selection[i].id)
                    }
                    this.$http.post('/resertPwds', arr).then(res => {
                        if (res.data == "success") {
                            this.$message.success("重置密码成功！")
                            //刷新表格
                            this.search()
                        } else {
                            this.$message.error("重置密码失败！")
                        }
                        this.selectionItems = []
                    }).catch(() => {
                        this.$message.error("操作失败，请联系管理员")
                    });
                })
            }

        },created() {
            //加载页面同时就请求部门列表
            this.getAllDepts()
            this.show_name='用户'
            this.url='/userListPage'
           // debugger
            this.upd_name='u'
            //页面初始加载的时候表格显示的是用户管理页面
            this.getList()
            this.$emit("backTitle",'管理员后台管理列表')
        }
    }
</script>

<style scoped>
    .dialog{
        width: 70%;
        margin: auto;
        color: white;
    }
    .itemStyle{
        color: gray;
    }
    .lableStyle{
        color: gray;
    }
</style>