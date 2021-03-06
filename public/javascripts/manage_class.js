$(document).ready(function(){
  var $manageClass = $('#manage_class');
  //class_name input limit
  $manageClass.delegate('input', 'keydown', function(event){
    return !(32 == event.keyCode);
  });

  //add class
  $('#add_class').click(function(event){
    var $className = $('#class_name');
    var className = $className.val();
    $className.val('');
    if('' == className){
      $('p.warn').html('分类名称不能为空').removeClass('sr-only');
    }else{
      var $classList = $('#class_list');
      var flag = false;
      $classList.find('input').each(function(){
        if(className == $(this).val()){
          flag = true;
          var $class = $(this).parent();
          if($class.hasClass('sr-only')){
            $class.removeClass('sr-only');
          }else{
            $('p.warn').html('已经添加过此分类').removeClass('sr-only');
            return false;
          }
        }
      });

      //new class
      if(!flag){
        var classStr = "<div class='cell'>" +
          "<input type='text' class='col-md-5 pull-left' maxlength='20' value='"+ className +"'>" +
          "<button class='btn btn-link pull-right'>删除</button>" +
          "</div>";
        $classList.append(classStr);
        $('p.warn').addClass('sr-only');
      }
    }
  });

  //delete class
  $manageClass.delegate('button.btn-link', 'click', function(){
    //$(this).parent().css('display', 'none');
    $(this).parent().addClass('hidden');
  });

  //save classes change
  $('#save_class_change').click(function(){
    var $classList = $('#class_list');
    //check repeat class_name
    var classNames = [];
    $classList.find('input').each(function(){
      if(!$(this).parent().hasClass('hidden')){
        classNames.push($(this).val());
      }
    });
    var classNameStr = ',' + classNames.join() + ',';
    for(var i = 0, len = classNames.length; i < len; i++){
      var index = classNameStr.indexOf(',' + classNames[i] + ',');
      var lastIndex = classNameStr.lastIndexOf(',' + classNames[i] + ',')
      if(index != -1 && lastIndex != -1 && index != lastIndex){
        $('p.warn').html('分类名重复').removeClass('sr-only');
        return false;
      }
    }

    var classes = [];
    $classList.find('input').each(function(){
      var cl = {};
      if($(this).attr('id') != undefined){
        if($(this).parent().hasClass('hidden')){
          cl._id = $(this).attr('id');
          cl.name = $(this).attr('name');
          cl.condition = 'delete';
          classes.push(cl);
        }else{
          if($(this).val() !== $(this).attr('name')){
            cl._id = $(this).attr('id');
            cl.name = $(this).val();
            cl.condition = 'modify';
            classes.push(cl);
          }
        }
      }else{
        if(!$(this).parent().hasClass('hidden')){
          cl.name = $(this).val();
          cl.condition = 'add';
          classes.push(cl);
        }
      }
    });
    $.post('/class/manage', {classes: classes}, function(data){
      location.href = '/content';
    }, 'json');
  });
});