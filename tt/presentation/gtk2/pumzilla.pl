#!/usr/bin/perl

# $Header: /cvsroot/gtk2-perl/gtk2-perl-xs/Gtk2-MozEmbed/examples/pumzilla,v 1.4 2005/04/11 22:30:40 kaffeetisch Exp $

package PumZilla;

# This is largely inspired by muppet's Gtk2::Html2 demonstration example
# MupZilla.

use strict;
use warnings;
use Glib qw(TRUE FALSE);
use Gtk2;
use Gtk2::MozEmbed;

use Glib::Object::Subclass
  Gtk2::Window::,
  properties => [
    Glib::ParamSpec -> flags("chrome",
                             "Chrome",
                             "The chrome to be applied",
                             "Gtk2::MozEmbed::Chrome",
                             "allchrome",
                             [qw/readable writable/])
  ];

sub INIT_INSTANCE {
  my ($self) = @_;
  my $chrome = $self -> get("chrome");

  $self -> set_title("PumZilla");

  Gtk2::MozEmbed -> set_profile_path($ENV{ HOME } . "/.pumzilla", "PumZilla");
  my $embed = Gtk2::MozEmbed -> new();

  my $box = Gtk2::VBox -> new(FALSE, 0);
  my $bar = Gtk2::Toolbar -> new();

  my $back = Gtk2::ToolButton -> new_from_stock("gtk-go-back");
  my $forward = Gtk2::ToolButton -> new_from_stock("gtk-go-forward");
  my $stop = Gtk2::ToolButton -> new_from_stock("gtk-stop");
  my $reload = Gtk2::ToolButton -> new_from_stock("gtk-refresh");
  my $home = Gtk2::ToolButton -> new_from_stock("gtk-home");

  foreach ($back, $forward, $stop) {
    $_ -> set_sensitive(FALSE);
  }

  $back -> signal_connect(clicked => sub {
    $embed -> go_back();
  });

  $forward -> signal_connect(clicked => sub {
    $embed -> go_forward();
  });

  $stop -> signal_connect(clicked => sub {
    $embed -> stop_load();
  });

  $reload -> signal_connect(clicked => sub {
    $embed -> reload(qw/reloadnormal/);
  });

  $home -> signal_connect(clicked => sub {
    $embed -> load_url("about:blank");
  });

  my $entry_item = Gtk2::ToolItem -> new();
  my $entry = Gtk2::Entry -> new();

  $entry -> signal_connect(activate => sub {
    my $url = $entry -> get_text();
    $embed -> load_url($url) if ($url);
  });

  $entry_item -> add($entry);
  $entry_item -> set_expand(TRUE);
  $entry_item -> set_border_width(4);

  $embed -> set_chrome_mask($chrome);
  $embed -> load_url("about:blank");

  $bar -> insert($back, 0);
  $bar -> insert($forward, 1);
  $bar -> insert($stop, 2);
  $bar -> insert($reload, 3);
  $bar -> insert($home, 4);
  $bar -> insert($entry_item, 5);

  my $status_box = Gtk2::HBox -> new(FALSE, 0);

  my $status = Gtk2::Statusbar -> new();
  my $context_id = $status -> get_context_id("Status");

  $status -> set_has_resize_grip(FALSE);

  my $progress = Gtk2::ProgressBar -> new();

  $status_box -> pack_start($status, TRUE, TRUE, 0);
  $status_box -> pack_start($progress, FALSE, FALSE, 0);

  $box -> pack_start($bar, FALSE, FALSE, 0);
  $box -> pack_start($embed, TRUE, TRUE, 0);
  $box -> pack_start($status_box, FALSE, FALSE, 0);

  $embed -> signal_connect(link_message => sub {
    $status -> push($context_id, $embed -> get_link_message());
  });

  $embed -> signal_connect(location => sub {
    $entry -> set_text($embed -> get_location());
  });

  $embed -> signal_connect(title => sub {
    my $title = $embed -> get_title();
    $self -> set_title($title ? "$title - PumZilla" : "PumZilla");
  });

  $embed -> signal_connect(net_start => sub {
    $status -> push($context_id, "Loading " . $embed -> get_location() . " ...");

    $stop -> set_sensitive(TRUE);

    $progress -> set_fraction(0);
  });

  $embed -> signal_connect(net_stop => sub {
    $status -> push($context_id, "");

    $stop -> set_sensitive(FALSE);
    $back -> set_sensitive($embed -> can_go_back());
    $forward -> set_sensitive($embed -> can_go_forward());

    $progress -> set_fraction(0);
  });

  $embed -> signal_connect(progress => sub {
    my ($embed, $cur, $max) = @_;

    if ($max < 1 || $cur > $max) {
      $progress -> pulse();
    }
    else {
      $progress -> set_fraction($cur / $max);
    }
  });

  $embed -> signal_connect(new_window => sub {
    my ($embed, $chrome) = @_;

    my $pumzilla = PumZilla -> new(chrome => $chrome);

    $pumzilla -> set_default_size(600, 400);
    $pumzilla -> show_all();

    return $pumzilla -> { _embed };
  });

  $box -> show_all();
  $self -> add($box);

  $entry -> grab_focus();

  $self -> { _embed } = $embed;
}

###############################################################################

package main;

use strict;
use warnings;
use Glib qw(TRUE FALSE);
use Gtk2 -init;

my $pumzilla = PumZilla -> new();

$pumzilla -> signal_connect(delete_event => sub {
  Gtk2 -> main_quit;
  return FALSE;
});

$pumzilla -> set_default_size(600, 400);
$pumzilla -> show_all();

Gtk2 -> main;
