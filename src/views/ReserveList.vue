<template>
    <div>
        <el-form :inline="true" :model="query" class="formStyle">
            <el-form-item v-if="!userData.hasOwnProperty('job')">
                <span slot="label"><span class="lableStyle">员工编号：</span></span>
                <el-input v-model="query.eid" placeholder="输入要查询的员工编号"></el-input>
            </el-form-item>
            <el-form-item >
                <span slot="label"><span class="lableStyle">借款编号:</span></span>
                <el-input v-model="query.bid" placeholder="请输入借款编号" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <span slot="label"><span class="lableStyle">还款状态:</span></span>
                <el-select  v-model="query.rsid" clearable placeholder="请选择还款状态">
                    <!--循环遍历typeList，生成下拉列表的列表项-->
                    <el-option v-for="state in rstateList" :label="state.rsname" :value="state.rsid"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <div class="block">
                    <span class="demonstration">还款日期:</span>
                    <el-date-picker
                            v-model="query.rtime"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
            </el-form-item>
            <span style="float: right">
              <el-form-item>
                <el-button type="success" style="background-color: #00F5B1;color: white" @click="search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button  type="danger" @click="del">删除</el-button>
            </el-form-item>
            </span>
        </el-form>
        <el-table
            :cell-style="changeColor"
            :data="reserveData"
            stripe
            border
            highlight-current-row
            style="width: 95%"
            @select="selectRow"
            @selectAll="selectAll"
    >
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
        <el-table-column
                label="还款编号"
                prop="rid"
                width="90px">
        </el-table-column>
        <el-table-column
                label="员工编号"
                prop="eid"
                width="90px"
                v-if="userData.hasOwnProperty('aid')"
        >
        </el-table-column>
        <el-table-column
                label="员工姓名"
                prop="ename"
                width="90px"
                v-if="userData.hasOwnProperty('aid')"
        >
        </el-table-column>
            <el-table-column
                    label="借款编号"
                    prop="bid"
                    width="90px">
            </el-table-column>
            <el-table-column
                    label="借款金额"
                    prop="bmoney"
                    width="90px">
            </el-table-column>
            <el-table-column
                    label="借款状态"
                    prop="bsname"
                    width="90px">
            </el-table-column>
        <el-table-column
                label="还款金额"
                prop="rmoney"
                width="90px">
        </el-table-column>
        <el-table-column
                label="还款时间"
                prop="rtime"
                width="120px">
        </el-table-column>
        <el-table-column
                label="还款状态"
                prop="rsname"
                width="120px"
        >
        </el-table-column>
        <el-table-column
                label="审核不通过原因"
                prop="rback_reason"
                width="120px"
                :show-overflow-tooltip="true"
                :render-header="renderHeader"
         >
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                       <span v-if="userData.hasOwnProperty('eid')&&(scope.row.rsname=='待提交'||scope.row.rsname=='审核不通过')">
                 <el-button
                         size="mini"
                         style="background-color: orange;color: white"
                         @click="handleUpd(scope.$index, scope.row)">修改
                 </el-button>
                <el-button
                        size="mini"
                        style="background-color: #6236FF;color: white"
                        @click="handleSubmit(scope.$index, scope.row)">提交
                </el-button>
                </span>
                <span v-if="!(scope.row.rsname=='待提交'||scope.row.rsname=='审核不通过')||userData.hasOwnProperty('aid')">
                <el-button
                        size="mini"
                        style="background-color: #00F5B1;color: white"
                        @click="handleSelect(scope.$index, scope.row)">查看
                </el-button>
                    </span>
            </template>
        </el-table-column>
    </el-table>
        <!--分页-->
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
        <!--弹出层（对话框）-->
        <el-dialog :title="dialogTitle"  :visible.sync="dialogFormVisible" class="dialog" >
            <el-form :model="reserveForm" ref="reserveForm" :rules="rules">
                <el-form-item class="itemStyle" v-if="reserveForm.rid != ''" label="还款编号" :label-width="formLabelWidth" prop="rid">
                    <el-input  v-model="reserveForm.rid" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item class="itemStyle" label="还款金额" :label-width="formLabelWidth" prop="rmoney">
                    <el-input  v-model="reserveForm.rmoney" autocomplete="off"></el-input>
                </el-form-item>
                <!--还款日期后台自动获取-->
            </el-form>
            <div slot="footer">
                <el-button @click="dialogFormVisible = false" >取 消</el-button>
                <el-button type="primary" @click="saveDate">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="dialogTitle"  :visible.sync="dialogSelectVisible" class="dialog">
        <el-descriptions  :column="2" border >
                <el-descriptions-item label="还款编号">{{this.selectData.rid}}</el-descriptions-item>
                <el-descriptions-item label="员工编号">{{this.selectData.eid}}</el-descriptions-item>
                <el-descriptions-item label="员工姓名">{{this.selectData.ename}}</el-descriptions-item>
                <el-descriptions-item label="还款金额">{{this.selectData.rmoney}}</el-descriptions-item>
                <el-descriptions-item label="还款状态">
                    <el-tag size="small">{{this.selectData.rsname}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="还款日期">{{this.selectData.rtime}}</el-descriptions-item>
            </el-descriptions>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Reserve",
        data() {
            return {
                //查询还款信息列表
                query: {
                    bid: '',
                    eid:'',
                    rsid:'',
                    rtime:'',
                    page: 1,
                    limit: 5
                },
                //还款状态
                rstateList:[],
                dialogFormVisible: false,
                dialogSelectVisible: false,
                formLabelWidth: '80px',
                reserveForm:{
                    rid:'',
                    eid:'',
                    rmoney:'',
                    rsid:'',
                },
                total:0,
                //表单校验
                rules: {
                    rmoney: [
                        {required: true, message: "金额不能为空", trigger: "blur"}
                    ]
                },
                //表格绑定的data数据
                reserveData:[{
                }],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6;  //如果没有后面的-8.64e6就是不可以选择今天的
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                //被选中的选项的集合
                selectionItems:[],
                //弹出层标题
                dialogTitle:"",
                selectData:{
                    rid:'',
                    eid:'',
                    bid:'',
                    ename:'',
                    rmoney:'',
                    rsname:'',
                    rtime:'',
                },
                userData:JSON.parse(sessionStorage.getItem("userData"))
            }
        },
        methods: {
            renderHeader(h, data) {
                return h("span", [
                    h(
                        "el-tooltip",
                        {
                            attrs: {
                                class: "item",
                                effect: "dark",
                                content: data.column.label,
                                placement: "top",
                            },
                        },
                        [h("span", data.column.label)]
                    ),
                ]);
            },
            handleSubmit(index, row) {
                //判断借款提交到部门还是财务
                if (row.rmoney >= 2000) {
                    //大于两千先提交给财务
                    row.rsid=3
                } else {
                    //小于两千直接提交给部门
                    row.rsid=2
                }
                this.reserveForm = row
                this.reserveForm.rsid=row.rsid
                this.reserveForm.bsid=5
                this.reserveForm.rback_reason=''
                let msg = "提交"
                let arr=[];
                arr.push(this.reserveForm)
                this.$http.post("/updReserves", arr).then(res => {
                    if (res.data == "success") {
                        this.$message.success(msg + "成功")
                    } else {
                        this.$message.error(msg + "失败")
                    }
                    //重新加载表格
                    this.search()
                }).catch(() => {
                    this.$message.error(msg + "失败,请联系管理员")
                })
            },
            //条件查询
            getReserveList() {
                if (this.userData.hasOwnProperty('eid')) {
                    this.query.eid = this.userData.eid
                }
                this.$http.post("/reserveListPage", this.query).then(res => {
                    this.reserveData = res.data.data
                    this.total = res.data.count
                }).catch(() => {
                    this.$message.error("还款信息加载失败请联系管理员")
                })
            },
            search() {
                //点击查询按钮
                this.query.page = 1
                this.getReserveList()
            },
            //获取全部的还款状态信息
            getAllRStates() {
                this.$http.post("/rstateList").then(res => {
                        this.rstateList = res.data
                }).catch(() => {
                    this.$message.error("还款状态加载失败，请联系管理员")
                })
            },
            //每页多少条
            handleSizeChange(val) {
                this.query.limit = val
                this.search()
            },
            //当前在第几页
            handleCurrentChange(val) {
                this.query.page = val
                this.getReserveList()
            },
            selectRow(selection,row) {
                this.selectionItems = selection
            },
            selectAll(selection){
                this.selectionItems=selection
            },
            //弹出层修改
            handleUpd(index,row){

                //打开弹出层
                this.dialogFormVisible = true
                //修改标题
                this.dialogTitle="修改还款信息"
                //重置表单
                if (this.$refs["reserveForm"] !=null){
                    this.$refs["reserveForm"].resetFields()
                }
                //给表单项赋值
                this.reserveForm = row
                this.reserveForm.rback_reason=''
            },
            handleSelect(index,row){
                //打开弹出层
                this.dialogSelectVisible = true
                //修改标题
                this.dialogTitle="查看借款信息"
                //给表单项赋值
                this.selectData = row
            },
            del(){
                let selection=this.selectionItems
                //判断被选中的条数
                if(selection.length==0) {
                    this.$message.warning("请选择一条数据")
                    return
                }
                //判断选中是否为待提交
                for (let i = 0; i < selection.length ; i++) {
                    if (selection[i].rsid!=1) {
                        this.$message.error("只能删除待提交状态的还款记录")
                        return
                    }
                }
                //要求用户确认
                this.$confirm('确定要删除所选员工吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    //获取被选中项的主键
                    let arr=[];
                    for(let i=0;i<selection.length;i++){
                        arr.push(selection[i].rid)
                    }
                    this.$http.post("/delReserves",arr).then(res=>{
                        if (res.data=="success"){
                            this.$message.success("删除成功")
                            //刷新表格
                            this.search()
                        }else {
                            this.$message.error("删除失败")
                        }
                        this.selectionItems=[]
                    }).catch(() => {
                        this.$message.error("删除失败，请联系管理员")
                    });
                })
            },
            saveDate() {
                //保存前要先做表单校验
                this.$refs["reserveForm"].validate(valid => {
                    let url = "/updReserve";
                    let msg = "修改"
                    if (valid) {
                        this.$http.post(url, this.reserveForm).then(res => {
                            if (res.data == "success") {
                                this.$message.success(msg+"成功")
                            } else {
                                this.$message.error(msg+"失败")
                            }
                            this.dialogFormVisible = false
                            this.search()
                        }).catch(() => {
                            this.$message.error(msg+"失败,请联系管理员")
                        })
                    }
                })
            },
            //改变字体颜色 还款状态 待提交时候橙色，待部门审核、待财务审核时候蓝色，审核不通过红色，待还款、审核通过绿色
            //借款状态带提交时候橙色，待部门审核、待财务审核时候蓝色，审核不通过红色，待还款、部分还款绿色，已还清灰色
            changeColor({row, column}){
                //判断颜色
                if (column.property=='rsname'){
                    switch(row.rsname){
                        case '待提交':
                            return 'color:orange'
                        case '部门审核':
                            return 'color:#6236FF'
                        case '财务审核':
                            return 'color:#0263F1'
                        case '审核不通过':
                            return 'color:red'
                        default:
                            return 'color:#00F5B1'
                    }
                }
            },
        }
        , created() {
            //页面一加载时候就去请求还款状态列表
            this.getAllRStates();
            this.search();
            this.$emit("backTitle",'还款信息列表')
        }
    }
</script>

<style scoped>
    .el-table .cell {
        word-break: keep-all !important;
        white-space: nowrap !important;
    }
    .formStyle{
        color: white;
    }
    .lableStyle{
        color: white;
    }
</style>
