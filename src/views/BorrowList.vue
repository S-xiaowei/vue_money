<template>
    <div>
        <el-form :inline="true" :model="query" class="formStyle">
            <el-form-item v-if="userData.hasOwnProperty('aid')">
                <span slot="label"><span class="lableStyle">员工编号:</span></span>
                <el-input v-model="query.eid" placeholder="输入要查询的员工编号"></el-input>
            </el-form-item>
            <el-form-item >
                <span slot="label"><span class="lableStyle">借款类型:</span></span>
                <el-select  v-model="query.tid" clearable placeholder="选择查询的借款类型">
                    <!--循环遍历typeList，生成下拉列表的列表项-->
                    <el-option v-for="type in btypeList" :label="type.tname" :value="type.tid"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <span slot="label"><span class="lableStyle">借款状态:</span></span>
                <el-select  v-model="query.bsid" clearable placeholder="选择查询的借款状态">
                    <!--循环遍历typeList，生成下拉列表的列表项-->
                    <el-option v-for="state in bstateList" :label="state.bsname" :value="state.bsid"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <div class="block">
                    <span class="demonstration">借款日期:</span>
                    <el-date-picker
                            v-model="query.btime"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button  type="danger" @click="del">删除记录</el-button>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" @click="search" style="background-color: #00F5B1;color: white">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right" v-if="userData.hasOwnProperty('eid')">
                <el-button type="primary" @click=" addBorrow">申请借款</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="borrowData"
                stripe
                border
                :cell-style="changeColor"
                style="width: 95%"
                @select="selectRow"
                @selectAll="selectAll"
        >
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column
                    label="借款编号"
                    prop="bid"
                    width="80px">
            </el-table-column>
            <el-table-column
                    label="员工编号"
                    prop="eid"
                    width="80px"
                    v-if="userData.hasOwnProperty('aid')"
            >
            </el-table-column>
            <el-table-column
                    label="员工姓名"
                    prop="ename"
                    width="80px"
                    v-if="userData.hasOwnProperty('aid')"
            >
            </el-table-column>
            <el-table-column
                    label="所属部门"
                    prop="dname"
                    width="80px"
                    v-if="userData.hasOwnProperty('aid')"
            >
            </el-table-column>
            <el-table-column
                    label="借款金额"
                    prop="bmoney"
                    width="80px">
            </el-table-column>
            <el-table-column
                    label="借款类型"
                    prop="tname"
                    width="80px">
            </el-table-column>
            <el-table-column
                    label="借款原因"
                    prop="breason"
                    width="80px">
            </el-table-column>
            <el-table-column
                    label="待还金额"
                    prop="bstill_money"
                    width="80px">
            </el-table-column>
            <el-table-column
                    label="借款日期"
                    prop="btime"
                    width="130px">
            </el-table-column>
            <el-table-column
                    label="借款状态"
                    prop="bsname"
                    width="100px"
            >
            </el-table-column>
             <el-table-column
                     label="不通过原因"
                     prop="bback_reason"
                     width="100px"
                     :show-overflow-tooltip="true"
                     :render-header="renderHeader"
             >
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                <span v-if="(scope.row.bsname=='待提交'||scope.row.bsname=='审核不通过')&&userData.hasOwnProperty('eid')">
                 <el-button
                         size="mini"
                         style="margin-left:5px;background-color: orange;color: white"
                         @click="handleUpd(scope.$index, scope.row)">修改
                 </el-button>
                <el-button
                        size="mini"
                        style="background-color: #6236FF;color: white"
                        @click="handleSubmit(scope.$index, scope.row)">提交
                </el-button>
                </span>
                <el-button
                        v-if="!(scope.row.bsname=='待提交')||userData.hasOwnProperty('aid')"
                        size="mini"
                        style="margin-left:5px;background-color: #00F5B1;color: white"
                        @click="handleSelect(scope.$index, scope.row)">查看
                </el-button>
                <el-button
                        size="mini"
                        style="background-color: #409EFF;color: white"
                        @click="handleAddReserve(scope.$index, scope.row)"
                        v-if="userData.hasOwnProperty('eid')&&(scope.row.bsname=='待还款'||scope.row.bsname=='部分还清')"
                >申请还款
                </el-button>

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
        <el-dialog :title="dialogTitle"  :visible.sync="dialogBorrowFormVisible" class="dialog">
            <el-form :model="borrowForm" ref="borrowForm" :rules="borrowRules">
                <el-form-item class="itemStyle" label="借款金额" :label-width="formLabelWidth" prop="bmoney">
                    <el-input  v-model="borrowForm.bmoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item class="itemStyle" label="借款类型" :label-width="formLabelWidth" prop="tid">
                    <el-select style="width: 100%" v-model="borrowForm.tid" placeholder="请选择借款类型" clearable :disabled="this.isDisable">
                        <el-option v-for="btype in btypeList" :label="btype.tname" :value="btype.tid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="itemStyle" label="借款原因" :label-width="formLabelWidth" prop="breason">
                    <el-input type="textarea"  v-model="borrowForm.breason" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="dialogBorrowFormVisible = false" ref="updFalse">取 消</el-button>
                <el-button type="primary" @click="saveBorrow" ref="updTrue">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="dialogTitle"  :visible.sync="dialogReserveFormVisible" class="dialog" >
            <el-form :model="reserveForm" ref="reserveForm" :rules="reserveRules">
                <el-form-item class="itemStyle" label="借款编号" :label-width="formLabelWidth" prop="bid">
                    <el-input  v-model="reserveForm.bid" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item class="itemStyle" label="借款金额" :label-width="formLabelWidth" prop="bmoney">
                    <el-input  v-model="reserveForm.bmoney" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item class="itemStyle" label="待还金额" :label-width="formLabelWidth" prop="bstill_money">
                    <el-input  v-model="reserveForm.bstillMoney" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item class="itemStyle" label="还款金额" :label-width="formLabelWidth" prop="rmoney">
                    <el-input  v-model="reserveForm.rmoney" autocomplete="off"></el-input>
                </el-form-item>
                <!--还款日期后台自动获取-->
            </el-form>
            <div slot="footer">
                <el-button @click="dialogReserveFormVisible = false" >取 消</el-button>
                <el-button type="primary" @click="saveReserve">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="dialogTitle"  :visible.sync="dialogSelectFormVisible" class="dialog">
            <el-descriptions  :column="3" border >
                <el-descriptions-item label="借款编号" >{{this.selectData.bid}}</el-descriptions-item>
                <el-descriptions-item label="员工编号">{{this.selectData.eid}}</el-descriptions-item>
                <el-descriptions-item label="员工姓名">{{this.selectData.ename}}</el-descriptions-item>
                <el-descriptions-item label="借款金额">{{this.selectData.bmoney}}</el-descriptions-item>
                <el-descriptions-item label="待还金额">{{this.selectData.bstill_money}}</el-descriptions-item>
                <el-descriptions-item label="借款状态">
                    <el-tag size="small">{{this.selectData.bsname}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="借款类型">
                    <el-tag size="small">{{this.selectData.tname}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="借款日期">{{this.selectData.btime}}</el-descriptions-item>
                <el-descriptions-item label="借款原因" :contentStyle="{'text-align': 'center'}">{{this.selectData.breason}}</el-descriptions-item>
                <el-descriptions-item label="审核拒绝原因" v-if="this.selectData.bback_reason!=''" style="color: darkgrey">{{this.selectData.bback_reason}}</el-descriptions-item>
            </el-descriptions>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        name: "Borrow",
        data() {
            var checkBmoney = (rule, value, callback) => {
                const r = /^\d+[\.]?[0-9][1-9]?$/; // 金额只能是的整数或1-2位小数
                if (value == null || String(value).trim() === "") {
                    callback(new Error('借款金额不能为空！'));
                } else if (!r.test(value)) {
                    callback(new Error("借款金额只能是的整数或1-2位小数！"));
                } else {
                    callback();
                }
            };
            var checkRmoney = (rule, value, callback) => {
                const r = /^\d+[\.]?[0-9][1-9]?$/; // 金额只能是的整数或1-2位小数
                if (value == null || String(value).trim() === "") {
                    callback(new Error('还款金额不能为空！'));
                } else if (value == 0) {
                    callback(new Error("还款金额不能为零！"));
                } else if (!r.test(value)) {
                    callback(new Error("还款金额只能是整数或保留1-2位小数！"));
                } else if (value > this.reserveForm.bstillMoney) {
                    callback(new Error("还款金额不能大于待还金额！"));
                } else {
                    callback();
                }
            };
            return {
                //查询借款信息列表
                query: {
                    eid: '',
                    bid: '',
                    tid: '',
                    bsid: '',
                    btime: '',
                    page: 1,
                    limit: 5
                },
                //借款类型
                btypeList: [],
                //借款状态
                bstateList: [],
                dialogBorrowFormVisible: false,
                dialogReserveFormVisible: false,
                dialogSelectFormVisible: false,
                formLabelWidth: '80px',
                borrowForm: {
                    eid:'',
                    bid:'',
                    bmoney: '',
                    tid: '',
                    breason: '',
                    btime: '',
                    bstillMoney: '',
                    bsid: '',
                    bbackReason:''
                },
                reserveForm: {
                    rid: '',
                    bstillMoney: '',
                    bmoney: '',
                    eid: '',
                    rmoney: '',
                    rsid: '',
                    rtime: ''
                },
                total: 0,
                //表单校验
                borrowRules: {
                    bmoney: [
                        {required: true, validator: checkBmoney, trigger: "blur"}
                    ],
                    tid: [
                        {required: true, message: "类型不能为空", trigger: "change"}
                    ],
                    breason: [
                        {required: true, message: "原因不能为空", trigger: "change"}
                    ]
                },
                reserveRules: {
                    rmoney: [
                        {required: true, validator: checkRmoney, trigger: "blur"}
                    ]
                },
                //表格绑定的data数据
                borrowData: [{}],
                selectData: {
                    bid: '',
                    eid: '',
                    ename: '',
                    bmoney: '',
                    tname: '',
                    bsname: '',
                    btime: '',
                    bstill_money: '',
                    breason: '',
                    bback_reason:'',
                },
                //被选中的选项的集合
                selectionItems: [],
                //弹出层标题
                dialogTitle: '',
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
                isDisable: false,
                isShow: false,
                nowTime: '',//显示当前时间
                userData:JSON.parse(sessionStorage.getItem("userData")),
                bnowTime:''
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
            //条件查询
            getBorrowList() {
                if (this.userData.hasOwnProperty('eid')) {
                    this.query.eid = this.userData.eid
                }
                this.$http.post("/borrowListPage", this.query).then(res => {
                    this.borrowData = res.data.data
                    this.total = res.data.count
                    //const self = this
                }).catch(() => {
                    this.$message.error("借款信息加载失败请联系管理员")
                });
            },
            search() {
                //点击查询按钮
                this.query.page = 1
                this.getBorrowList()
            },
            //获取全部的借款类型信息
            getAllTypes() {
                this.$http.post("/typeList").then(res => {
                    this.btypeList = res.data
                }).catch(() => {
                    this.$message.error("借款类型加载失败，请联系管理员")
                })
            },
            //获取全部的借款状态信息
            getAllBStates() {
                this.$http.post("/bstateList").then(res => {
                    this.bstateList = res.data
                }).catch(() => {
                    this.$message.error("借款状态加载失败，请联系管理员")
                })
            },
            //改变字体颜色  带提交时候橙色，待部门审核、待财务审核时候绿色，审核不通过红色，待还款、部分还款蓝色，已还清灰色
            changeColor({row, column}) {
                //判断颜色
                if (column.property == 'bsname') {
                    switch (row.bsname) {
                        case '待提交':
                            return 'color:orange'
                        case '部门审核':
                            return 'color:#6236FF'
                        case '财务审核':
                            return 'color:#0263F1'
                        case '审核不通过':
                            return 'color:red'
                        case '已还清':
                            return 'color:grey'
                        default:
                            return 'color:#00F5B1'
                    }
                }
            },
            //每页多少条
            handleSizeChange(val) {
                this.query.limit = val
                this.search()
            },
            //当前在第几页
            handleCurrentChange(val) {
                this.query.page = val
                this.getBorrowList()
            },
            selectRow(selection, row) {
                console.log("selection:" + selection + "row" + row)
                this.selectionItems = selection
            },
            selectAll(selection) {
                this.selectionItems = selection
            },
            //弹出层增删改
            addBorrow() {
                this.isDisable = false//增加时不禁用下拉框
                this.borrowForm={
                        eid:'',
                        bid:'',
                        bmoney: '',
                        tid: '',
                        breason: '',
                        btime: '',
                        bstillMoney: '',
                        bsid: '',
                }
                //打开弹出层
                this.dialogBorrowFormVisible = true
                //修改标题
                this.dialogTitle = "申请借款"
            },
            saveBorrow() {
                //保存前要先做表单校验
                this.$refs["borrowForm"].validate(valid => {
                    let url = "/updBorrow";//默认路径为修改借款信息
                    let msg = "修改借款"
                    //console.log(this.borrowForm.bid)
                    if (valid) {
                        //判断是新增还是修改
                        if (this.borrowForm.bid == "") {
                            url = "/addBorrow";
                            msg = "新增借款"
                        }
                        this.borrowForm.bstillMoney = this.borrowForm.bmoney//待还金额新增时候为借款金额
                        this.borrowForm.bsid = 1//借款状态新增时候为1待提交
                        this.borrowForm.eid = this.userData.eid
                        this.borrowForm.btime = this.bnowTime//获取当前时间为新增借款时间
                        this.$http.post(url, this.borrowForm).then(res => {
                            if (res.data == "success") {
                                this.$message.success(msg + "成功")
                            } else {
                                this.$message.error(msg + "失败")
                            }
                            //关闭弹出层
                            this.dialogBorrowFormVisible = false
                            //重新加载表格
                            this.search()
                            this.getBorrowList(this.borrowData, this.total)
                        }).catch(() => {
                            this.$message.error(msg + "失败,请联系管理员")
                        })
                    }
                })
            },
            saveReserve() {
                //保存前要先做表单校验
                this.$refs["reserveForm"].validate(valid => {
                    let url = "/addReserve";
                    let msg = "新增还款"
                    if (valid) {
                        this.reserveForm.rsid = 1//还款状态新增时候为1待提交
                        this.reserveForm.rtime = this.bnowTime//获取当前时间为新增还款时间
                        this.$http.post(url, this.reserveForm).then(res => {
                            if (res.data == "success") {
                                this.$message.success(msg + "成功")
                                this.$router.push({
                                    path: "/reserveList",
                                })
                            } else {
                                this.$message.error(msg + "失败")
                            }
                            //关闭弹出层
                            this.dialogReserveFormVisible = false
                            //重新加载表格
                            this.search()
                        }).catch(() => {
                            this.$message.error(msg + "失败,请联系管理员")
                        })
                    }
                })
            },
            handleUpd(index, row) {
                this.isDisable = false//修改时不禁用下拉框
                //重置表单
                this.borrowForm={
                    eid:'',
                    bid:'',
                    bmoney: '',
                    tid: '',
                    breason: '',
                    btime: '',
                    bstillMoney: '',
                    bsid: '',
                    bbackReason:''
                }
                //给表单项赋值
                this.borrowForm = row
                this.borrowForm.bback_reason=''
                //只有状态为1待提交的时候才可以修改
                this.dialogBorrowFormVisible = true
                //修改标题
                this.dialogTitle = "修改借款信息"
            },
            handleAddReserve(index, row) {
                //打开弹出层
                this.dialogReserveFormVisible = true
                //修改标题
                this.dialogTitle = "申请还款"
                //清空表单
                if (this.$refs["reserveForm"] != null) {
                    this.$refs["reserveForm"].resetFields()
                }

                this.reserveForm = {
                    bid: row.bid,
                    bmoney: row.bmoney,
                    eid: sessionStorage.getItem("eid"),
                    bstillMoney: row.bstill_money,
                    bbackReason:'',
                    rmoney: '',
                    rtime: this.nowTime,//获取当前时间为还款时间
                    rsid: 1//增加还款时候还款状态默认为1
                }
            },
            handleSubmit(index, row) {
                //判断借款提交到部门还是财务
                if (row.bmoney >= 2000) {
                    //大于两千先提交给财务
                    row.bsid=3
                } else {
                    //小于两千直接提交给部门
                    row.bsid=2
                }
                this.borrowForm = row
                this.borrowForm.bsid=row.bsid
                this.borrowForm.bstillMoney=row.bmoney
                this.borrowForm.bback_reason=''
                let msg = "提交"
                this.$http.post("/updBorrow", this.borrowForm).then(res => {
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
            handleSelect(index, row) {
                //打开弹出层
                this.dialogSelectFormVisible = true
                //修改标题
                this.dialogTitle = "查看借款信息"
                //给表单项赋值
                this.selectData = row
            },
            del() {
                //要求用户确认
                //判断被选中的条数
                let selection = this.selectionItems
                if (selection.length == 0) {
                    this.$message.warning("请选择一条数据")
                    return
                }
                //判断借款状态是否为待提交
                for (let i = 0; i < selection.length; i++) {
                    if (selection[i].bsid != 1) {
                        this.$message.error("只能删除待提交状态的借款记录")
                        return
                    }
                }
                this.$confirm('确定要删除所选员工吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    //获取被选中项的主键
                    let arr = [];
                    for (let i = 0; i < selection.length; i++) {
                        arr.push(selection[i].bid)
                    }
                    this.$http.post("/delBorrows", arr).then(res => {
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
            //显示当前时间（年月日时分秒）
            timeFormate(timeStamp) {
                let year = new Date(timeStamp).getFullYear();
                let month = new Date(timeStamp).getMonth() + 1 < 10 ? "0" + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1;
                let date = new Date(timeStamp).getDate() < 10 ? "0" + new Date(timeStamp).getDate() : new Date(timeStamp).getDate();
                this.bnowTime = year + "-" + month + "-" + date ;
            },
            nowTimes() {
                this.timeFormate(new Date());
                setInterval(this.nowTimes, 1000);
                //清除定时器，解决网页卡顿问题
                clearInterval(this.nowTimes);
                this.nowTimes = null;
            },
        }
        , created() {
            //页面一加载时候就去请求借款类型，借款状态,根据uid获取Emp
            this.getAllTypes();
            this.getAllBStates();
            this.search();
            this.nowTimes() //获取时间的方法
            this.$emit("backTitle",'借款信息列表')
        },
        beforeDestroy() { //销毁定时器
            clearInterval(this.nowTimes)
            this.nowTimes = null;
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
    .itemStyle{
        width:300px;
        margin:25px auto;
    }

</style>
