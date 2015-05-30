#Validate
Validate是基于jQuery的一款轻量级验证插件，内置丰富的验证规则，还有灵活的自定义规则接口，HTML、CSS与JS之间的低耦合能让您自由布局和丰富样式，支持input,select,textarea的验证。

###Description
* 浏览器支持：IE7+ 、Chrome、Firefox、Safari、Mobile Browser
* jQuery版本：1.7.0+
* version:1.2.0

###Usage
**载入jQuery、validate**
```html
    <script type="text/javascript" src="jquery-1.11.1.js"></script>
    <script type="text/javascript" src="jquery-validate.js"></script>
```
**DOM标签验证规则填写**

```html
<div class="form_control">
  <input class="required" value="315359131@qq.com" type="text" name="email" data-tip="请输入您的邮箱" data-valid="isNonEmpty||isEmail" data-error="email不能为空||邮箱格式不正确">
</div>
<div class="form_control">
  <select class="required" data-valid="isNonEmpty" data-error="省份必填">
    <option value="">请选择省份</option>
    <option value="001">001</option>
    <option value="002">002</option>
  </select>
</div>
```

* 给需要验证的表单元素的class填入required（不建议在这个class上做其他样式）。
* 建议input用独立div包裹，因为验证的message是从当前input的父元素上append生成。
* **data-tip**：在尚未验证而获取焦点时出现的提示。
* **data-valid**：验证规则，若有组合验证，以||符号分割。
* **data-error**：验证错误提示，对应data-valid，以||符号分割。
* **单选/复选比较特殊，需要添加元素包裹单选/复选集合，并在包裹元素上加验证规则。**

```html
<div class="form_control">
  <span class="required" data-valid="isChecked" data-error="性别必选" data-type="radio">
      <label><input type="radio" name="sex">男</label>
      <label><input type="radio" name="sex">女</label>
      <label><input type="radio" name="sex">未知</label>
  </span>
</div>
<div class="form_control">
  <span class="required" data-valid="isChecked" data-error="标签至少选择一项" data-type="checkbox">
      <label><input type="checkbox" name="label">红</label>
      <label><input type="checkbox" name="label">绿</label>
      <label><input type="checkbox" name="label">蓝</label>
  </span>
</div>
```

**JS调用**

```js
//**注意：必须以表单元素调用validate**
  $('form').validate({
  	type:{
      isChecked: function(value, errorMsg, el) {
        var i = 0;
        var $collection = $(el).find('input:checked');
        if (!$collection.length) {
          return errorMsg;
        }
      }
    },
    onFocus: function() {
      this.parent().addClass('active');
      return false;
    },
    onBlur: function() {
      var $parent = this.parent();
      var _status = parseInt(this.attr('data-status'));
      $parent.removeClass('active');
      if (!_status) {
        $parent.addClass('error');
      }
      return false;
    }
  });
```

<table>
    <tr>
        <th>Method</th>
        <th>Params</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
    	<td>onFocus</td>
    	<td>arguments => event</td>
    	<td>Function</td>
    	<td>获取焦点时的callback</td>
    </tr>
    <tr>
    	<td>onBlur</td>
    	<td>arguments => event</td>
    	<td>Function</td>
    	<td>失去焦点时的callback</td>
    </tr>
    <tr>
    	<td>onChange</td>
    	<td>arguments => event</td>
    	<td>Function</td>
    	<td>触发change的callback</td>
    </tr>
    <tr>
    	<td>type</td>
    	<td colspan="3">自定义验证规则，参数顺序：value,errorMsg,el</td>
    </tr>
</table>

**表单提交前的验证**
```js
  $('form').on('submit', function(event) {
    event.preventDefault();
    $(this).validate('submitValidate'); //return true or false;
  });
```