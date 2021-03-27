<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_id" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}</template
          >
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="修改地址"
      @close="addressClose"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form
        :model="addAddressForm"
        :rules="addAddressFormRules"
        ref="addAddressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县:" prop="address1">
          <!-- options指定数据源 -->
          <el-cascader
            class="AddressCascader"
            v-model="addAddressForm.address1"
            :options="cityData"
            :props="cascaderProps"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度 -->
    <el-dialog title="物流进度" :visible.sync="dialogProVisible" width="50%">
    </el-dialog>
  </div>
</template>
<script>
import cityData from './city.data-3.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      orderlist: [],
      total: 0,
      dialogVisible: false,
      addAddressForm: {
        address1: [],
        address2: '',
      },
      addAddressFormRules: {
        address1: [
          {
            required: true,
            message: '请输入省市区/县',
            trigger: 'blur',
          },
        ],
        address2: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur',
          },
        ],
      },
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
      },
      cityData,
      dialogProVisible: false,
      progressInfo: [],
    }
  },
  created() {
    this.getOrderList()
    console.log('cityData')
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      console.log(res.data)
      this.orderlist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showBox() {
      this.dialogVisible = true
    },
    addressClose() {
      this.$refs.addAddressFormRef.resetFields()
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')

      if (res.meta.status !== 200) {
        return this.$message.error('获取货流进度失败')
      }
      this.progressInfo = res.data
      console.log(res.data)
      console.log('res.data')
      console.log("11")
      this.dialogProVisible = true
    },
  },
}
</script>
<style Lang="less" scoped>
.AddressCascader {
  width: 100%;
}
</style>