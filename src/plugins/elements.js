import app from '@utils/app';
import "element-plus/lib/theme-chalk/base.css";
import { ElIcon, ElContainer, ElHeader, ElMain, ElCol, ElRow, ElInput, ElImage, ElMessage, ElSkeleton, ElSkeletonItem, ElCarousel, ElCarouselItem, ElDialog, ElForm, ElFormItem, ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElPopover, ElPagination, ElInfiniteScroll, ElBacktop, ElMessageBox, ElTooltip } from 'element-plus';

const components = [ ElIcon, ElContainer, ElHeader, ElMain, ElCol, ElRow, ElInput, ElImage, ElSkeleton, ElSkeletonItem, ElCarousel, ElCarouselItem, ElDialog, ElForm, ElFormItem, ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElPopover, ElPagination, ElBacktop, ElTooltip ];
const plugins = [ ElMessage, ElInfiniteScroll, ElMessageBox ]

components.forEach(component => {
    app.component(component.name, component)
});

plugins.forEach(plugin => {
    app.use(plugin)
});

app.config.globalProperties['$msg'] = ElMessage;
app.config.globalProperties['$msgBox'] = ElMessageBox;