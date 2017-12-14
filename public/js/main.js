$(document).ready(function(){
  $('.delete-profesor').on('click', function(e){
    $target = $(e.target);
    var id =($target.attr('data-id'));
    $.ajax({
      type:'DELETE',
      url: '/profesori/'+id,
      success: function(response){
        alert('Brisete profesora');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
