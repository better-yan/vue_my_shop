<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i
              ></el-col>

              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
              <!-- <el-col></el-col> -->
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="roleName"></el-table-column>
        <el-table-column label="路径" prop="roleDesc"></el-table-column>
        <el-table-column label="权限等级" prop="level" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="showEditDialg(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 内容主题区域 -->
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        show-checkbox
        ref="treeRef"
      ></el-tree>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="editRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名" prop="roleName" disabled>
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 角色列表数据
  data() {
    return {
      roleList: [],
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      addRoleFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 10,
            trigger: 'blur',
            message: '角色名的长度在3~10个字符之间',
          },
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 10,
            trigger: 'blur',
            message: '角色描述的长度在3~10个字符之间',
          },
        ],
      },
      editRoleForm: {},
      setRightDialogVisible: false,

      rightsList: [],
      //   树形结构
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      defKeys: [],
      //   即将分配角色的id
      roleId: '',
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      this.roleList = res.data
      console.log(this.roleList)
    },
    addRole() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return
        // console.log()
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status != 201) {
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        // 关闭弹框
        this.addRoleDialogVisible = false
        // 重新获取用户列表
        this.getRoleList()
      })
    },
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 修改对话框
    async showEditDialg(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('修改角色失败')
      }
      // this.$message.success('修改用户成功')
      this.editRoleForm = res.data
      this.editRoleDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 修改角色信息并提交
    editRoleInfo() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return
        // console.log(this.editRoleForm.roleId)
        const { data: res } = await this.$http.put(
          'roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc,
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('更新角色失败')
        }

        // 关闭对话框
        this.editRoleDialogVisible = false
        // 刷新列表
        this.getRoleList()
        // 修改成功
        this.$message.success('更新角色成功')
      })
    },
    // 删除角色
    async removeRoleById(id) {
      // 弹框询问角色是否删除数据
      const confirmRes = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => {
        return err
      })
      if (confirmRes !== 'confirm') {
        return this.$message.info('删除角色操作取消')
      }
      const { data: res } = await this.$http.delete('roles/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      // 删除成功
      this.$message.success('删除角色成功')
      this.getRoleList()
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => {
        return err
      })

      if (confirmRes !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      //   this.$message.success('删除角色成功')
      //   this.getRoleList()
      //   防止直接关闭扩展的内容
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }

      this.rightsList = res.data
      console.log(this.rightsList)
      //   三级节点id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        // 当前节点不包括chirlren则是三级节点
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      console.log(this.roleId)

      const idStr = keys.join(',')
      console.log(idStr)
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    },
  },
}
</script>
<style Lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>