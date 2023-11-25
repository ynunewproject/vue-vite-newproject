import { App } from 'vue';
import 'element-plus/theme-chalk/index.css';
import {
    ElButton, ElForm, ElFormItem, ElSwitch, ElInput, ElContainer, ElHeader,ElMain,ElRow,
    ElCol,ElCheckbox,ElImage,ElAvatar,ElPopover,ElUpload,ElIcon,ElCard,ElScrollbar,ElDialog,ElCarousel,ElCarouselItem,
    ElMenu,ElSubMenu,ElTable,ElTableColumn,ElOption,ElSelect,ElCollapseItem,ElCollapse,ElTag,
} from 'element-plus';


export default function setupElementPlus(app: App): void {
    app.use(ElButton);
    app.use(ElForm);
    app.use(ElFormItem);
    app.use(ElSwitch);
    app.use(ElInput);
    app.use(ElContainer);
    app.use(ElHeader);
    app.use(ElMain);
    app.use(ElRow);
    app.use( ElCol);
    app.use(ElCheckbox);
    app.use(ElImage);
    app.use(ElAvatar);
    app.use(ElPopover);
    app.use(ElUpload);
    app.use(ElIcon);
    app.use(ElCard);
    app.use(ElScrollbar);
    app.use(ElDialog);
    app.use(ElCarousel);
    app.use(ElCarouselItem);
    app.use(ElMenu);
    app.use(ElSubMenu);
    app.use(ElTable);
    app.use(ElTableColumn);
    app.use(ElOption);
    app.use(ElSelect);
    app.use(ElCollapseItem);
    app.use(ElCollapse);
    app.use(ElTag);

}
