<template>
    <div>
    <el-tabs type="card" style="width: 95%;background-color: white">

        <!--借款审核-->
        <el-tab-pane>
         <span style="margin-left:570px">
              <el-button type="success" @click="updateBorrow('access')" style="border-color:#42b983;background-color: #00F5B1;color: white">通过申请</el-button>
              <el-button type="danger" @click="updateBorrow('refuse')">驳回申请</el-button>
        </span>
            <span slot="label"><i class="el-icon-date"></i> 借款审核</span>
            <el-table
                    :data="borrowData"
                    stripe
                    border
                    highlight-current-row
                    @select="selectBorrowRow"
                    @selectAll="selectBorrowAll"
            >
                <el-table-column
                        type="selection"
                        width="50">
                </el-table-column>
                <el-table-column
                        label="借款编号"
                        prop="bid"
                        width="90px">
                </el-table-column>
                <el-table-column
                        label="员工编号"
                        prop="eid"
                        width="90px">
                </el-table-column>
                <el-table-column
                        label="员工姓名"
                        prop="ename"
                        width="90px">
                </el-table-column>
                <el-table-column
                        label="所属部门"
                        prop="dname"
                        width="90px">
                </el-table-column>
                <el-table-column
                        label="借款金额"
                        prop="bmoney"
                        width="90px">
                </el-table-column>
                <el-table-column
                        label="待还金额"
                        prop="bstill_money"
                        width="90px">
                </el-table-column>
                <el-table-column
                        label="借款类型"
                        prop="tname"
                        width="90px">
                </el-table-column>
                <el-table-column
                        label="借款原因"
                        prop="breason"
                        width="110px"
                >
                </el-table-column>
                <el-table-column
                        label="借款日期"
                        prop="btime"
                        width="110px"
                       >
                </el-table-column>
                <el-table-column
                        label="借款状态"
                        prop="bsname"
                        >
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination
                    @size-change="handleBorrowSize"
                    @current-change="handleBorrowChange"
                    :current-page="queryBorrow.page"
                    :page-sizes="[5,10,15,20]"
                    :page-size="queryBorrow.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="borrowTotal"
            >
            </el-pagination>
        </el-tab-pane>

        <!--还款审核-->
        <el-tab-pane>
        <span style="margin-left:570px ">
              <el-button type="success" @click="updateReserve('access')" style="border-color:#42b983;background-color: #00F5B1;color: white">通过申请</el-button>
              <el-button type="danger" @click="updateReserve('refuse')">驳回申请</el-button>
        </span>
            <span slot="label"><i class="el-icon-s-data"></i> 还款审核</span>
            <el-table
                    :data="reserveData"
                    stripe
                    border
                    highlight-current-row
                    @select="selectReserveRow"
                    @selectAll="selectReserveAll"
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
                        width="90px">
                </el-table-column>
                <el-table-column
                        label="员工姓名"
                        prop="ename"
                        width="90px">
                </el-table-column>
                <el-table-column
                        label="借款编号"
                        prop="bid"
                        width="90px">
                </el-table-column>
                <el-table-column
                        label="所属部门"
                        prop="dname"
                        width="90px"
                >
                </el-table-column>
                <el-table-column
                        label="借款金额"
                        prop="bmoney"
                        width="90px">
                </el-table-column>
                <el-table-column
                        label="待还金额"
                        prop="bstill_money"
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
                       >
                </el-table-column>
                <el-table-column
                        label="还款状态"
                        prop="rsname"
                       >
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination
                    @size-change="handleReserveSize"
                    @current-change="handleReserveChange"
                    :current-page="queryReserve.page"
                    :page-sizes="[5,10,15,20]"
                    :page-size="queryReserve.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="reserveTotal"
            >
            </el-pagination>
        </el-tab-pane>

        <!--借款审核拒绝的原因弹出层-->
        <el-dialog title="借款拒绝原因" :visible.sync="dialogBRefuseVisible" width="45%">
                <el-form    :rules="rulesRefuse" v-model="brefuseForm">
                    <el-form-item  prop="bbackReason" >
                        <el-input type="textarea" :rows="5" style="width: 50%" v-model="bbackReason" placeholder="请输入拒绝原因"></el-input>
                        <span style="width: 200px;display: inline-block ">
                        <el-link type="primary" @click="checkBRefuse(1)">借款金额不符合申请条件</el-link>
                        <br>
                        <el-link type="primary" @click="checkBRefuse(2)">申请原因不具体</el-link>
                        <br>
                        <el-link type="primary" @click="checkBRefuse(3)">未有申请资格</el-link>
                        <br>
                        <el-link type="primary" @click="checkBRefuse(4)">暂未到申请时间</el-link>
                        <br>
                        <el-link type="primary" @click="checkBRefuse(5)">其他原因</el-link>
                    </span>
                    </el-form-item>
                </el-form>
            <div slot="footer">
                <el-button @click="closeDialog('b')">取 消</el-button>
                <el-button type="primary" @click="saveBRefuse" >提 交</el-button>
            </div>
        </el-dialog>
        <!--还款审核拒绝原因-->
        <el-dialog title="还款拒绝原因" :visible.sync="dialogRRefuseVisible" width="45%">
            <el-form   label-width="80px">
                <el-form-item  prop="bbackReason" :rules="rrulesRefuse" v-model="rrefuseForm">
                <el-input type="textarea" style="width: 50%" :rows="5" v-model="rbackReason"></el-input>
                <span style="width: 200px;display: inline-block ">
                 <el-link type="primary" @click="checkRRefuse(1)">还款金额不符合标准</el-link>
                <br>
                <el-link type="primary" @click="checkRRefuse(2)">申请原因不具体</el-link>
                <br>
                <el-link type="primary" @click="checkRRefuse(3)">还款未到账</el-link>
                <br>
                <el-link type="primary" @click="checkRRefuse(4)">其他原因</el-link>
                </span>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="closeDialog('r')" >取 消</el-button>
                <el-button type="primary" @click="saveRRefuse" >提 交</el-button>
            </div>
        </el-dialog>

    </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "check",
        data(){
            return{
                dialogBRefuseVisible:false,
                dialogRRefuseVisible:false,
                rbackReason:"",
                bbackReason:"",
                //查询借款信息列表
                queryBorrow: {
                    eid:'',
                    bid: '',
                    tid: '',
                    did:'',
                    bsid:'',
                    btime:'',
                    page: 1,
                    limit: 5
                },
                //查询还款信息列表
                queryReserve: {
                    eid:'',
                    bid: '',
                    rsid:'',
                    rtime:'',
                    did:'',
                    page: 1,
                    limit: 5
                },
                borrowData:[{
                }],
                reserveData:[{
                }],
                //被选中的借款选项的集合
                selectionBorrow:[],
                //被选中的还款选项的集合
                selectionReserve:[],
                borrowTotal:0,
                reserveTotal:0,
                userData:JSON.parse(sessionStorage.getItem("userData")),
                arr:[],
                borrowSelect:{},
                reserveSelect:{},
                brefuseForm:{},
                rrefuseForm:{},
                rulesRefuse:{
                    bbackReason: [{ required: true, message: '请输入借款审核拒绝原因', trigger: 'blur' }]
                },
                rrulesRefuse:{
                    rbackReason: [{ required: true, message: '请输入还款审核拒绝原因', trigger: 'blur' }]
                }
            }
        },
        methods:{
            closeDialog(val){
                if (val=='b'){
                    this.dialogBRefuseVisible = false
                    this.getBorrowList()
                    this.bbackReason=""
                } else {
                    this.dialogRRefuseVisible = false
                    this.getReserveList()
                    this.rbackReason=""
                }
            },
            //条件查询
            getBorrowList() {
                if (this.userData.job=='经理'){
                    this.queryBorrow.did=this.userData.did
                    this.queryBorrow.bsid=2//待部门审核
                }if (this.userData.dname=='财务部'){
                    this.queryBorrow.bsid=3//待财务审核
                }
                this.$http.post("/borrowListPage", this.queryBorrow).then(res => {
                    this.borrowData = res.data.data
                    this.borrowTotal = res.data.count
                }).catch(() => {
                    this.$message.error("借款信息加载失败请联系管理员")
                })
            },
            getReserveList() {
                if (this.userData.job=='经理'){
                    this.queryReserve.did=this.userData.did
                    this.queryReserve.rsid=2//待部门审核
                }if (this.userData.dname=='财务部'){
                    this.queryReserve.rsid=3//待财务审核
                }
                this.$http.post("/reserveListPage", this.queryReserve).then(res => {
                    this.reserveData = res.data.data
                    this.reserveTotal = res.data.count
                }).catch(() => {
                    this.$message.error("还款信息加载失败请联系管理员")
                })
            },
            //获取选中的借款
            selectBorrowRow(selection,row) {
                this.selectionBorrow = selection
            },
            selectBorrowAll(selection){
                this.selectionBorrow=selection
            },

            //获取选中的还款
            selectReserveRow(selection,row) {
                this.selectionReserve = selection
            },
            selectReserveAll(selection){
                this.selectionReserve=selection
            },
            //每页多少条
            handleBorrowSize(val) {
                this.queryBorrow.limit = val
                this.queryBorrow.page = 1
                this.getBorrowList()
            },
            //当前在第几页
            handleBorrowChange(val) {
                this.queryBorrow.page = val
                this.getBorrowList()
            },
            //每页多少条
            handleReserveSize(val) {
                this.queryReserve.limit = val
                this.queryReserve.page = 1
                this.getReserveList()
            },
            //当前在第几页
            handleReserveChange(val) {
                this.queryReserve.page = val
                this.getReserveList()
            },
            //修改借款审核状态
            updateBorrow(choice){
                //判断是否只选中了一条
                let selection=this.selectionBorrow
                if(selection.length==0) {
                    this.$message.warning("请选择一条数据")
                    return
                }
                let msg='通过'
                if (choice=='refuse'){
                    msg = '拒绝'
                }
                this.$confirm('确定要'+msg+'所选借款申请吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    for(let i=0;i<selection.length;i++){
                        //确认后，修改所选字段
                        this.borrowSelect = selection[i]
                        if (choice=='access'){
                            if (this.borrowSelect .bsid==3){
                                this.borrowSelect .bsid=2//财务审核提交到部门审核
                            }else {
                                this.borrowSelect .bsid=5//部门审核通过，借款状态为，待还款
                            }
                            this.arr.push(this.borrowSelect)
                            this.$http.post("/updBorrows",this.arr).then(res=>{
                                if (res.data=="success"){
                                    this.$message.success("操作成功")
                                    //刷新表格
                                    this.getBorrowList()
                                    this.selectionBorrow=[]
                                }else {
                                    this.$message.error("操作失败")
                                }
                                this.selectionReserve=[]
                            }).catch(() => {
                                this.$message.error("操作失败，请联系管理员")
                            });
                        }else {//拒绝的情况
                            this.dialogBRefuseVisible=true
                        }
                    }
                })
            },
            saveBRefuse(){
                debugger
                let selection=this.selectionBorrow
                for(let i=0;i<selection.length;i++) {
                    //确认后，修改所选字段
                    this.borrowSelect = selection[i]
                    this.borrowSelect.bsid = 4//审核不通过
                    this.borrowSelect.bbackReason = this.bbackReason
                    this.arr.push(this.borrowSelect)
                }
                    this.$http.post("/updBorrows",this.arr).then(res => {
                        if (res.data == "success") {
                            this.$message.success("操作成功")
                            this.selectionReserve = []
                            this.dialogBRefuseVisible = false
                            this.bbackReason = ""
                            //刷新表格
                            this.getBorrowList()
                        } else {
                            this.$message.error("操作失败")
                        }
                    }).catch(() => {
                        this.$message.error("操作失败，请联系管理员")
                    });
                this.selectionBorrow=[]
            },
            //修改还款审核状态
            updateReserve(choice){
                //判断是否只选中了一条
                let selection=this.selectionReserve
                if(selection.length==0) {
                    this.$message.warning("请选择一条数据")
                    return
                }
                let msg
                if (choice=="access"){
                    msg="通过"
                } else {
                    msg="驳回"
                }
                this.$confirm('确定要'+msg+'所选还款申请吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    for(let i=0;i<selection.length;i++){
                        let reserveSelect = selection[i]
                        //提交的字段关联查询修改借款状态
                        console.log(reserveSelect)
                        debugger
                        if (choice=='access') {
                            if (reserveSelect.rsid==3){
                                reserveSelect.rsid=2//财务审核提交到部门审核
                            }else {
                                reserveSelect.rsid=4//部门审核通过，还款状态为，审核通过
                                //部门审核通过，修改待还金额
                                if ( reserveSelect.bstill_money-reserveSelect.rmoney==0){
                                    reserveSelect.bsid=7//全部还清，借款状态
                                    reserveSelect.bstill_money=0
                                }else {
                                    reserveSelect.bsid=6//部分还清，借款状态
                                    reserveSelect.bstill_money=reserveSelect.bstill_money-reserveSelect.rmoney
                                }
                            }
                            this.arr.push(reserveSelect)
                            this.$http.post("/updReserves",this.arr).then(res=>{
                                if (res.data=="success"){
                                    this.$message.success("操作成功")
                                    //刷新借款和还款表格
                                    this.getReserveList()
                                    this.getBorrowList()
                                    this.selectionReserve=[]
                                }else {
                                    this.$message.error("操作失败")
                                }
                            }).catch(() => {
                                this.$message.error("操作失败，请联系管理员")
                            });
                        }else {//选择驳回申请
                            this.dialogRRefuseVisible=true
                        }
                    }
                })
            },
            saveRRefuse(){
                let selection=this.selectionReserve
                for(let i=0;i<selection.length;i++) {
                    this.reserveSelect = selection[i]
                    this.reserveSelect.rsid =5//还款状态审核不通过
                    this.reserveSelect.bsid=5//待还款
                    this.reserveSelect.rbackReason=this.rbackReason
                    this.arr.push(this.reserveSelect)
                }
                this.$http.post("/updReserves",this.arr).then(res=>{
                    if (res.data=="success"){
                        this.$message.success("操作成功")
                        this.selectionReserve=[]
                        this.dialogRRefuseVisible=false
                        this.rbackReason=""
                        //刷新表格
                        this.getReserveList()
                    }else {
                        this.$message.error("操作失败")
                    }
                }).catch(() => {
                    this.$message.error("操作失败，请联系管理员")
                });
                this.selectionReserve=[]
            },
            //选择链接文字选择拒绝原因
            checkBRefuse(val){
             switch (val) {
                 case 1:
                     this.$nextTick(() => {
                         this.bbackReason = this.bbackReason + "借款金额不符合申请条件 "
                     })
                     break
                 case 2:
                     this.bbackReason=this.bbackReason+"申请原因不具体 "
                     break
                 case 3:
                     this.bbackReason=this.bbackReason+"未有申请资格 "
                    break
                 case 4:
                     this.bbackReason=this.bbackReason+"暂未到申请时间 "
                    break
                 case 5:
                     this.bbackReason=this.bbackReason+"其他原因  "
             }
        },
            checkRRefuse(val){
                switch (val) {
                    case 1:
                        this.rbackReason=this.rbackReason+"还款金额不符合标准"
                        break
                    case 2:
                        this.rbackReason=this.rbackReason+"申请原因不具体"
                        break
                    case 3:
                        this.rbackReason=this.rbackReason+"还款未到账"
                        break
                    case 4:
                        this.rbackReason=this.rbackReason+"其他原因"
                }
            }
        }
        , created() {
            if (this.userData.job=='经理'){
                this.queryBorrow.bsid=2
                this.queryReserve.rsid=2
                this.queryReserve.did=this.userData.did
                this.$emit("backTitle",'部门审核列表')
            }else if (this.userData.dname=='财务部'){
                this.queryBorrow.bsid=3
                this.queryReserve.rsid=3
                this.$emit("backTitle",'财务审核列表')
            }
            this.getBorrowList()
            this.getReserveList()
        }
    }
</script>

<style scoped>

</style>