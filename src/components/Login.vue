<template>
    <div class="login">
        <el-dialog v-model="isVisible" width="30%" :before-close="handleClose">
            <div class="login-wrapper">
                <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width>
                    <el-form-item prop="phone" label-width>
                        <el-input
                            v-model="loginForm.phone"
                            placeholder="请输入网易云帐号"
                            prefix-icon="iconfont icon-phone"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="pwd" label-width>
                        <el-input
                            v-model="loginForm.pwd"
                            placeholder="请输入密码"
                            show-password
                            prefix-icon="iconfont icon-pwd"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitForm">登录</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { computed, getCurrentInstance, reactive, ref, toRefs } from '@vue/runtime-core';
import { useStore } from 'vuex'
export default {
    name: 'Login',
    setup(props) {
        const store = useStore();
        const { proxy } = getCurrentInstance();
        const isVisible = ref(true);

        const handleClose = () => store.commit('setLoginDialog', false);

        const formInfo = reactive({
            loginForm: {
                phone: '',
                pwd: ''
            },
            loginFormRules: {
                phone: [{ required: true, message: '请输入网易帐号', trigger: 'blur' }],
                pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        });

        const submitForm = () => {
            proxy.$refs.loginFormRef.validate(async (valid) => {
                if (valid) {
                    const { data: res } = await proxy.$http.login(formInfo['loginForm']);

                    if (res.code !== 200) {
                        proxy.$msg.error(res.msg)
                    } else {
                        getUserInfo(res.profile.userId)
                        window.localStorage.setItem('token', res.token)
                        window.localStorage.setItem('cookie', res.cookie)
                        store.commit('setLoginDialog', false);
                    }
                }
            })
        }

        const getUserInfo = async (uid) => {
            const { data: res } = await proxy.$http.getUserInfo({ uid: uid })

            if (res.code !== 200) {
                proxy.$msg.error(res.msg)
            } else {
                window.localStorage.setItem('isLogin', true);
                window.localStorage.setItem('userInfo', JSON.stringify(res.profile));
                store.commit('SET_LOGIN', true);
                store.commit('setUserInfo', res.profile);
            }
        }

        return {
            handleClose,
            isVisible,
            ...toRefs(formInfo),
            submitForm,

        }
    }
}
</script>
<style scoped lang="less">
.login {
    :deep(.el-dialog__body) {
        padding: 30px 20px 0;
    }

    .dialog-footer {
        position: relative;
        z-index: 2;
        display: block;
        width: 100%;
        .el-button {
            width: 100%;
            background-color: #335eea;
        }
    }
}
</style>
